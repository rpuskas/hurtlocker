$(function(){
	
	HL = (function(){
		var cell_locator = function(row,column){
			return $("#g1" + "r" + row + "c" + column);
		}

		var convert_to_mine_cell = function(row,column){
			
			var cell = {};
			var state = cell_locator(row,column).attr('class');
		
			if(state === 'unclicked'){
				cell.chance = MineCell.UNEVAL;	
				cell.state = state;
			} 
			else if(state === 'marked'){
				cell.chance = MineCell.A_BOMB;
				cell.state = state;
			} 
			else if(state.indexOf('mines') >= 0){
				cell.state = parseInt(state.replace('mines',''));
				cell.chance = MineCell.NO_CHANCE;
			} 
			else throw 'cell value not recognized';	
			
			return cell;
		}
		
		
		return{
			
			create_minefield: function(){
				
				var mines_remaining = parseInt($('#g1minesRemaining').attr('title'));
				var length = $('tr.field:first').find('td').length;
				var width = $('tr.field').length;
				
				return new Minefield(new Grid(length,width,convert_to_mine_cell),mines_remaining);
			},
			click_cell : function(position) {	
				cell_locator(position.x,position.y).trigger({
					type: 'mouseup',
					which: 1
				});
			},
			mark : function(position){
				cell_locator(position.x,position.y).trigger({
					type: 'mouseup',
					which: 2
				});
			},
			mark_all : function(positions) {					
				var that = this;
				if(positions.length > 0) positions.forEach(function(position){ that.mark(position); })
			},
			alive : function(){
				return $('#g1indicator').attr('class') === "status alive";
			}
		}
	})();
	

	var solve_next_move = function(){
		
		var minefield = HL.create_minefield();
		minefield.evaluate_all_cells();
		var unclicked_bombs = minefield.get_unmarked_bombs();
		
		if(unclicked_bombs.length > 0){
			HL.mark_all(_.map(unclicked_bombs,function(x){ return minefield.data.indexOf(x); }));
			HL.mark_all(unclicked_bombs);
			unclicked_bombs.forEach(function(x){ x = minefield.data.indexOf(x); });

			return solve_next_move();
		}
	
		// console.log(minefield.to_s());
		var position = minefield.data.indexOf(minefield.next_click());
		HL.click_cell(position);
		// console.log('clicked[x,y]: ' + position.x + ' ' + position.y);
		
		if(HL.alive()) solve_next_move();
		
	};
	solve_next_move();
	
});
