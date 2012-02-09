$(function(){
	
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
			if(value === 'unclicked') return MineCell(value,no_chance);	
			else if(value === 'marked') return MineCell(value,guarentee);
			else if(value.indexOf('mines') >= 0) return MineCell(get_mine_count(value),no_chance);
			else throw 'cell selector not found';
		}
		
		return{
			cell_value: function(value){
				return cell_value(value);
			},
			refresh: function(){
				return new Grid($('tr.field:first').find('td').length,$('tr.field').length,cell_value_locator);
			},
			click_cell : function(position) {	
				cell_locator(position.x,position.y).trigger({
					type: 'mouseup',
					which: 1
				});
			},
			mark : function(position) {	
				cell_locator(position.x,position.y).trigger({
					type: 'mouseup',
					which: 2
				});
			}
		}
	})();
	
	var pad =function(number) {

	    var str = '' + number;
	    while (str.length < 7) {
	        str = ' ' + str;
	    }

	    return str;

	}
	
	var counter = 0;
	var run_until_solved = function(){
		
		var mines_remaining = parseInt($('#g1minesRemaining').attr('title'));
		var minefield = new Minefield(HL.refresh(),mines_remaining);
		minefield.evaluate_all_cells();
		
		var unclicked_bombs = minefield.get_unmarked_bombs();
		if(unclicked_bombs.length > 0){
			unclicked_bombs.forEach(function(cell){
				HL.mark(minefield.data.indexOf(cell));
			})
		}
		console.log(minefield.data.to_s(function(x){return pad(Math.round(x.chance*100)/100)}));

		var x = minefield.next_click();
		
		var next = minefield.data.indexOf(x)
		HL.click_cell(next);
		
		if($('#g1indicator').attr('class') === 'status alivePressed') return;
		if(minefield.unclickedSquares === $('#g1minesRemaining').attr('title')) return;
		
		//run_until_solved();
	}
	
	run_until_solved();	
	
});
