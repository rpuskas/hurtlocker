(function(){
	
Minefield = function(data,bombs){

	var _bombs = bombs;
	var _data = data;
	
	min_val = function(first,second){
		return first > second ? second : first;
	}
			
	return {
		
		next_click: function(){
			this.evaluate_all_cells();
			return _data.min(function(min,current){ return min.chance <= current.chance ? min : current });
		},
		
		random_chance: function(){
			var unclicked = _data.reduce(function(x,y){ return _data.grid[x][y].state == 'unclicked'; })
			return _bombs / unclicked;
		},
		
		set_neighbors_chance: function(x,y,random_chance){
			
			var neighbors = _data.neighbors(x,y);
			var home = _data.grid[x][y];
			
			var unclicked_neighbors = _.filter(neighbors,function(neighbor){ return neighbor.state === 'unclicked' });
			var unclicked_neighbor_chance = home.state / unclicked_neighbors.length;
			for(var i = 0; i < unclicked_neighbors.length; i++){
				var min = min_val(unclicked_neighbors[i].chance, unclicked_neighbor_chance);
				unclicked_neighbors[i].chance = min_val(random_chance,min);
			}
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

HL = (function(){
	
	var cell_locator = function(row,column){
		return $("#g1" + "r" + row + "c" + column);
	}
	
	var cell_value_locator = function(row,column){
		var cell_id = "#g1" + "r" + row + "c" + column;
		return cell_value($(cell_id).attr('class'));
	}
	
	var cell_value = function(value){
		
		var chance = 1;
		if(value == 'marked' || value == 'unclicked'){}
		else{
			chance = 1.1;
			value = value.replace('mines','');
		}

		return MineCell(value,chance)
	}
	
	return{
		
		cell_value: function(value){
			return cell_value(value);
		},
				
		refresh: function(){
			return Grid.create(
				$('tr.field').length,
				$('tr.field:first').find('td').length,
				cell_value_locator);
		},
		
		click_cell : function(row,column) {	
			cell_locator(row,column).trigger({
				type: 'mouseup',
				which: 1
			});
		}
				
	}
})();

Grid = function(x,y,cell_value){

	var rows = y;
	var columns = x;
	this.grid = Array(rows);
	
	for(var x = 0;x<rows;x++){
		this.grid[x] = Array(columns)
		for(var y = 0;y<columns;y++){
			this.grid[x][y] = cell_value(x,y);
		}
	}
	
};

Grid.prototype.length = function(){
 	return this.grid.length;
}

Grid.prototype.width = function(){
	return this.grid[0].length;
}

Grid.prototype.each = function(action){
	var total = 0;
	for(var row = 0;row < this.grid.length; row++){
		for(var column = 0; column < this.grid[row].length; column++){
			action(row,column);		
		}
	}
};

Grid.prototype.to_s = function(){
	var result = '';
	var end_of_row = this.grid[0].length-1;

	that = this;
	this.each(function(x,y){
		result += that.grid[x][y];
		y === end_of_row ? result += '\n' : result += '|';
	});

	return result.substring(0,result.length-1);
}		

Grid.prototype.find = function(cell){

	return_val = null;
	that = this;
	this.each(function(x,y){
		if (that.grid[x][y] == cell) { return_val = {x: x, y: y} };
	});

	return return_val;
		
}		
	
Grid.prototype.reduce = function(criteria){
	var total = 0;
	this.each(function(x,y){
		if(criteria(x,y)){ total = total + 1; }
	});
	
	return total;
}		

Grid.prototype.min = function(get_min){
	that = this;
	var min_cell = that.grid[0][0];
	this.each(function(x,y){
		min_cell = get_min(min_cell,that.grid[x][y]);
	});
	
	return min_cell;			
}		

Grid.prototype.neighbors = function(x,y){

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

}());
