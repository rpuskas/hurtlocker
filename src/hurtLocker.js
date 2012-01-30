(function(){
	
//MineField should be able to be solved without any need from the dom
MineField = function(data){

	var _data = data;
	var mark_remaining = function(){
		
	}
	
	grid_reduce = function(action){

		// for(row = 0;row < HL.grid_data.rows; row++){
		// 	for(column = 0; column < HL.grid_data.columns; column++){
		// 		action(total,HL.cell_locator(row,column))			
		// 	}
		// }

	}
	
	return {
		
		//Public API
		next_click: function(){
			//for all cells get min probability
			//if there is a tie, pick one closest to middle (hot to get middle)
			//return {x:'x-val',y:'y-val'};
		},
		
		evaluate_all_cells: function(){
			//for all cells left to right, top to bottom evaluate_bomb_likelyhood
			//evaluate_bomb_likelyhood(x,y)
		},
		
		random_click_probability: function(){
			//estimated mines remaining div unclicked squares
		},
		
		evaluate_bomb_likelyhood: function(x,y){
		
			//evaluate the likelyhood of a bomb being on a square
			//it will need to feed this into evolving grids structure
			
			//return [cell value] / [unclicked neighbors]
			
		}
	}
}

DomAdaper = (function(){
	
	var cell_locator = function(row,column){
		return $("#g1" + "r" + row + "c" + column).attr('class');
	}
	
	var cell_value = function(value){
		if(value == 'marked' || value == 'unclicked'){
			return value
		}
		return value.replace('mines','');
	}
	
	var create_minefield = function(rows, columns,cell_locator){

		var minefield = Array(rows);
		for(var x = 0;x<rows;x++){
			minefield[x] = Array(columns)
			for(var y = 0;y<columns;y++){
				minefield[x][y] = HL.cell_value(cell_locator(x,y));
			}
		}
		return minefield;
	}
	
	return{
				
		refresh_minefield = function(){
			return HL.create_minefield(
				$('tr.field').length,
				$('tr.field:first').find('td').length,
				HL.cell_locator);
		},
		
		click_cell = function(row,column) {	
			HL.cell_locator(row,column).trigger({
				type: 'mouseup',
				which: 1
			});
		}
				
	}
})();


}());

$(function(){
	
	var run_until_solved = function(){

		var minefield = new Minefield(HL.refresh_minefield())
		HL.click_cell(minefield.next_click()) === 'clicked_mine' || return;
		minefield.unclickedSquares === $('#g1minesRemaining').attr('title') && return;
		
		run_until_solved();
		
	}	
	
});
