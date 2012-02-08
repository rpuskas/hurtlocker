describe('hurt_locker_tests', function(){
			
	it('should_translate_cell_class_value_into_grid_value', function(){
		
		expect(HL.cell_value('unclicked').state).toEqual('unclicked');
		expect(HL.cell_value('mines1').state).toEqual('1');
		expect(HL.cell_value('mines2').state).toEqual('2');
		expect(HL.cell_value('mines3').state).toEqual('3');
		expect(HL.cell_value('mines4').state).toEqual('4');
		expect(HL.cell_value('mines5').state).toEqual('5');
		expect(HL.cell_value('mines6').state).toEqual('6');
		expect(HL.cell_value('marked').state).toEqual('marked');
		
	});
	
});

Mother = (function(){
	return{
		unclicked: function(rows,columns){
			return new Grid(rows,columns,function(){ return {state:'unclicked',chance:100}})
		}
	}	
	
}());

describe('grid_utility', function(){

	it('should_create_grid_with_values_set_to_cell_values',function(){
		var grid = new Grid(3,3,function(x,y){return 9});
		window.debug = grid;
		expect(grid.length()).toEqual(3);
		expect(grid.width()).toEqual(3);
		// expect(grid[0][0]).toEqual(9);
	});
	
	it('should_get_neighboring_cells', function(){
		grid = Mother.unclicked(3,3);
		expect(grid.neighbors(1,1).length).toEqual(8);
		expect(grid.neighbors(0,0).length).toEqual(3);
		expect(grid.neighbors(0,1).length).toEqual(5);
		
		expect(grid.neighbors(0,1)[0].chance).toEqual(100);
		expect(grid.neighbors(0,1)[0].state).toEqual('unclicked');
	});
	
	it('should_get_min_cell', function(){
		
		grid = Mother.unclicked(3,3);
		grid.grid[0][0] = MineCell(1,5);
		grid.grid[0][1] = MineCell(1,1);
		
		var min_cell = grid.min(function(min,current){ return min.chance <= current.chance ? min : current });
		
		expect(min_cell).toEqual(grid.grid[0][1]);
		
	});
	
	it('should_find_cell_position_in_grid', function(){
		
		grid = Mother.unclicked(3,3);
		var cell_to_find = grid.grid[1][2];
		
		var position = grid.find(cell_to_find);
		
		expect(position.x).toEqual(1);
		expect(position.y).toEqual(2);
		
	});
	
	it('should_get_string_version_of_grid', function(){
		grid = new Grid(2,2,function(){ return 'X'})
		result = grid.to_s();
		expect(result).toEqual('X|X\nX|X');
	});
	
});

describe('minefield',function(){
	
	it('should_calculate_random_square_probability', function(){
		expect(Minefield(Mother.unclicked(10,10),10).random_chance()).toEqual(0.1);
		expect(Minefield(Mother.unclicked(10,10),50).random_chance()).toEqual(0.5);
	});
	
	describe('when_a_cell_indicates_surrounding_mine_count',function(){
					
		var grid;
		var minefield;
		
		beforeEach(function(){
			grid = Mother.unclicked(3,3);
			minefield = Minefield(grid,1);
		});
		
		it('should_overwrite_neighboring_cells_probability_when_cacluated_value_is_lower', function(){
			grid.grid[0][0] = MineCell('unclicked',3/8);
			grid.grid[1][1] = MineCell(1,0);
			minefield.set_neighbors_chance(1,1,100);
			expect(grid.grid[0][0].chance).toEqual(1/8);
		});
		
		it('should_not_overwrite_neighboring_cells_probability_when_cacluated_value_is_higher',function(){
			
			grid.grid[0][0] = MineCell('unclicked',1/8);
			grid.grid[1][1] = MineCell(2,0);
			
			minefield.set_neighbors_chance(1,1,100);			
			expect(grid.grid[0][0].chance).toEqual(1/8);
		});
		
		it('should_evaluate_all_cells_neighbors_chance',function(){
			
			spyOn(minefield, 'set_neighbors_chance').andCallThrough();
			
			minefield.evaluate_all_cells();
			
			expect(minefield.set_neighbors_chance.callCount).toEqual(9);
			
		});
		
		it('should_get_next_click_by_the_minimum_cell', function(){
			
			var expected_min_cell = MineCell(0,0);
			spyOn(Grid.prototype, 'min').andReturn(expected_min_cell);
			spyOn(minefield,'evaluate_all_cells').andCallThrough();
			
			var next_click = minefield.next_click();
			
			expect(minefield.evaluate_all_cells).toHaveBeenCalled();
			expect(next_click).toEqual(expected_min_cell);
		});
		
	});
	
});
