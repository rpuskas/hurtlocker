(function(){

Minefield = {};	
Minefield = function(data,bombs){

	var _bombs = bombs;
	var _data = data;
	
	max_val = function(first,second){
		return first > second ? first : second;
	}
	
	//a bit of a smell... better way to initilize the default state?
	get_unclicked_neighbors_chance = function(home_state,number_of_neighbors,marked_neighbors){
		return isNaN(home_state) ? 0 : (home_state - marked_neighbors) / number_of_neighbors;
	}
			
	return {
		
		next_click: function(){
			return _data.min(function(min,current){ 
				if(current.chance == 0){
					return min;
				}
				return min.chance <= current.chance ? min : current 
			});
		},
		
		random_chance: function(){
			var unclicked = _data.reduce(function(x,y){ return _data.cell(x,y).state == 'unclicked'; })
			return _bombs / unclicked;
		},
		
		//This is the beast... significantly over functional, and under tested
		set_neighbors_chance: function(x,y,random_chance){
			var neighbors = _data.neighbors(x,y);
			var home = _data.cell(x,y);
			var bomb_certainty = 1;
			
			var unclicked_neighbors = _.filter(neighbors,function(neighbor){ return neighbor.state === 'unclicked' });
			var marked_neighbors = _.filter(neighbors,function(neighbor){ return neighbor.state === 'marked' });
			
			var unclicked_neighbor_chance = get_unclicked_neighbors_chance(home.state, unclicked_neighbors.length, marked_neighbors.length);
			
			for(var i = 0; i < unclicked_neighbors.length; i++){
				var min = max_val(unclicked_neighbors[i].chance, unclicked_neighbor_chance);				
				unclicked_neighbors[i].chance = max_val(random_chance,min);
			}
		},
		
		get_unmarked_bombs: function(){
			var unmarked_bombs = [];
			that = this;
			_data.each(function(x,y){
				cell = that.data.cell(x,y);//why is this not each item in grid?
				if(cell.chance === 1 && cell.state === 'unclicked'){
					unmarked_bombs.push(cell);
				}
			});
			return unmarked_bombs;
		},
		
		evaluate_all_cells: function(){
			var that = this
			_data.each(function(x,y){ that.set_neighbors_chance(x,y,that.random_chance()); });
		},
		
		data: _data
	}
}

MineCell = function(state,chance){
	return{
		state: state,
		chance: chance
	}
}


Grid = {};
Grid = (function(){
	
	Constr = function(columns,rows,cell_value){
		this.grid = Array(rows);
		for(var x = 0;x<rows;x++){
			this.grid[x] = Array(columns)
			for(var y = 0;y<columns;y++){
				this.set_cell(x,y,cell_value(x,y));
			}
		}
	}
	
	Constr.prototype = {
		constructor: Grid,		
		cell: function(x,y){ return this.grid[x][y]; },
		set_cell: function(x,y,obj){ this.grid[x][y] = obj; },
		length: function(){ return this.grid.length; },
		width: function(){ return this.grid[0].length; },

		each: function(action){
			var total = 0;
			for(var row = 0;row < this.grid.length; row++){
				for(var column = 0; column < this.grid[row].length; column++){
					action(row,column);		
				}
			}
		},

		to_s: function(cell_to_s){
			var result = '';
			var end_of_row = this.grid[0].length-1;

			that = this;
			this.each(function(x,y){
				result += cell_to_s(that.grid[x][y]);
				y === end_of_row ? result += '\n' : result += '|';
			});

			return result.substring(0,result.length-1);
		},	

		indexOf: function(cell){
			return_val = null;
			that = this;
			this.each(function(x,y){
				if (that.grid[x][y] == cell) { return_val = {x: x, y: y} };
			});

			return return_val;
		},		

		reduce: function(criteria){
			var total = 0;
			this.each(function(x,y){
				if(criteria(x,y)){ total = total + 1; }
			});

			return total;
		},	

		//passing in the function here from outside the program... should be some type of comparison opertor, even better, let the cell do it 
		min: function(get_min){
			that = this;
			var min_cell = MineCell(0,100);
			this.each(function(x,y){
				min_cell = get_min(min_cell,that.grid[x][y]);
			});

			return min_cell;			
		},		

		neighbors: function(x,y){
			var that = this;
			var not_null = function(column,row){ return that.grid[column] && that.grid[column][row]} //double check why this is DOM here
			var home_cell = function(column,row){ return (x === column && row === y) }

			var neighbors = [];
			for(var _column = x-1; _column<(x-1+3); _column++){
				for(var _row = y-1; _row < (y-1+3) ; _row++){
					if(!home_cell(_column,_row) && not_null(_column,_row)){
						neighbors.unshift(this.grid[_column][_row])
					}
				}
			}
			return neighbors;
		}
	}
	
	return Constr;
	
})();

}());
