$(function(){
	
	Utility = {};
	Utility.pad = function(number) {
	    var str = '' + number;
	    while (str.length < 7) { str = ' ' + str; }
	    return str;
	}
	
	HL = (function(){
		var cell_locator = function(row,column){
			return $("#g1" + "r" + row + "c" + column);
		}
		var cell_value_locator = function(row,column){
			var cell_id = "#g1" + "r" + row + "c" + column;
			return cell_value($(cell_id).attr('class'));
		}
		var get_mine_count = function(value){
			var mine_count = parseInt(value.replace('mines',''))
			return mine_count;
		}
		var cell_value = function(value){
			var no_chance = 0;
			var guarentee = 1;
			if(value === 'unclicked') return MineCell(value,-1);	
			else if(value === 'marked') return MineCell(value,guarentee);
			else if(value.indexOf('mines') >= 0) return MineCell(get_mine_count(value),no_chance);
			else throw 'cell selector not found';
		}
		
		return{
			cell_value: function(value){
				return cell_value(value);
			},
			create_minefield: function(){
				
				var mines_remaining = parseInt($('#g1minesRemaining').attr('title'));
				var length = $('tr.field:first').find('td').length;
				var width = $('tr.field').length;
				
				return new Minefield(new Grid(length,width,cell_value_locator),mines_remaining);
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
			// unclicked_bombs.forEach(function(x){ x = minefield.data.indexOf(x); console.log('marking: ' + x.x + ' ' + x.y) })

			return solve_next_move();
		}
	
		// console.log(minefield.data.to_s(function(x){return Utility.pad(Math.round(x.chance*100)/100)}));
		var position = minefield.data.indexOf(minefield.next_click());
		HL.click_cell(position);
		// console.log('clicked(x,y): ' + position.x + ' ' + position.y);
		
		//Need time to let the grid set itself up again... would be better if event based.
		//setTimeout(function() {
			if(HL.alive()) solve_next_move();
		//},1);
		
	};
	solve_next_move();
	
});
