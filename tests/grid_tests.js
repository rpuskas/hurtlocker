describe('grid_utility', function(){
	
	Mother = (function(){
		return{
			unclicked: function(rows,columns){
				return new Grid(rows,columns,function(){ return {state:'unclicked',chance:1}})
			}
		}	
	}());

	it('should_create_grid_with_values_set_to_cell_values',function(){
		var grid = new Grid(3,3,function(x,y){return 9});
		expect(grid.length()).toEqual(3);
		expect(grid.width()).toEqual(3);
	});
	
	it('should_get_neighboring_cells', function(){
		grid = Mother.unclicked(3,3);
		expect(grid.neighbors(1,1).length).toEqual(8);
		expect(grid.neighbors(0,0).length).toEqual(3);
		expect(grid.neighbors(0,1).length).toEqual(5);
		
		expect(grid.neighbors(0,1)[0].chance).toEqual(1);
		expect(grid.neighbors(0,1)[0].state).toEqual('unclicked');
	});
	
	it('should_get_min_cell', function(){
		
		grid = Mother.unclicked(3,3);
		
		var min_cell = grid.min(function(min,current){ return min.chance <= current.chance ? min : current });
		
		expect(grid.cell(0,1)).toEqual(min_cell);
		
	});
	
	it('should_find_cell_position_in_grid', function(){
		
		grid = Mother.unclicked(3,3);
		var cell_to_find = grid.cell(1,2);
		
		var position = grid.indexOf(cell_to_find);
		
		expect(position.x).toEqual(1);
		expect(position.y).toEqual(2);
		
	});
	
	it('should_get_string_version_of_grid', function(){
		grid = new Grid(2,2,function(){ return 'X'})
		result = grid.to_s(function(x){ return x;});
		expect(result).toEqual('X|X\nX|X');
	});
	
});