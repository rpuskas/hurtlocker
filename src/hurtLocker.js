(function(){
	
//MineField should be able to be solved without any need from the dom
Minefield = function(data,bombs){

	var _bombs = bombs;
	var _data = data;
		
	return {
		
		next_click: function(){
			//for all cells get min probability
			//if there is a tie, pick one closest to middle (hot to get middle)
			//return {x:'x-val',y:'y-val'};
		},
		
		evaluate_all_cells: function(){
			//for all cells left to right, top to bottom evaluate_bomb_likelyhood
			//evaluate_bomb_likelyhood(x,y)
		},
		
		random_chance: function(){
			var unclicked = Grid.reduce(_data,function(x,y){ return _data[x][y].state == 'unclicked'; })
			return _bombs / unclicked;
		},
		
		set_neighbors_chance: function(x,y){
			
			var neighbors = Grid.neighbors(_data,x,y);
			var home = _data[x][y];
			
			var unclicked_neighbors = _.filter(neighbors,function(neighbor){ return neighbor.state === 'unclicked' });
			
			for(var i = 0; i < unclicked_neighbors.length; i++){
				unclicked_neighbors[i].chance = home.state / unclicked_neighbors.length;
			}
		}
	}
}

MineCell = function(state,chance){
	return{
		state: state,
		chance: chance
	}
}

HL = (function(){
	
	var cell_locator = function(row,column){
		return $("#g1" + "r" + row + "c" + column).attr('class');
	}
	
	var cell_value_locator = function(row,column){
		return cell_value($("#g1" + "r" + row + "c" + column).attr('class'));
	}
	
	return{
		
		cell_value: function(value){
			
			if(value == 'marked' || value == 'unclicked'){}
			else{
				value = value.replace('mines','');
			}

			return MineCell(value,100)
		},
				
		refresh: function(){
			return Grid.create(
				$('tr.field').length,
				$('tr.field:first').find('td').length,
				cell_value_locator);
		},
		
		click_cell : function(row,column) {	
			HL.cell_locator(row,column).trigger({
				type: 'mouseup',
				which: 1
			});
		}
				
	}
})();

Grid = (function(){
	
	return{
		
		create : function(rows, columns,cell_value){
			var minefield = Array(rows);
			for(var x = 0;x<rows;x++){
				minefield[x] = Array(columns)
				for(var y = 0;y<columns;y++){
					minefield[x][y] = cell_value(x,y);
				}
			}
			return minefield;
		},
		
		reduce : function(grid,criteria){
			var total = 0;
			for(row = 0;row < grid.length; row++){
				for(column = 0; column < grid[row].length; column++){
					if(criteria(row,column)){
						total = total + 1;
					}			
				}
			}
			return total;
		},
		
		neighbors : function(grid,x,y){
			
			var not_null = function(x,y){ return grid[column] && grid[column][row]}
			var home_cell = function(column,row){ return (x == column && row == y) }
			
			var neighbors = [];
			for(column = x-1; column<(x-1+3); column++){
				for(row = y-1; row < (y-1+3) ; row++){
					if(!home_cell(column,row) && not_null(column,row)){
						neighbors.unshift(grid[column][row])
					}
				}
			}
			return neighbors;
		}		
	}
}());


}());

$(function(){
	
	// var run_until_solved = function(){
	// 
	// 	var minefield = new Minefield(HL.refresh_minefield())
	// 	
	// 	HL.click_cell(minefield.next_click()) === 'clicked_mine' || return;
	// 	minefield.unclickedSquares === $('#g1minesRemaining').attr('title') && return;
	// 	
	// 	run_until_solved();
	// 	
	// }	
	
});
