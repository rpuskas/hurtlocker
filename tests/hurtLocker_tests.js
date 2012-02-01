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
			return Grid.create(rows,columns,function(){ return {state:'unclicked',chance:100}})
		}
	}	
	
}());

describe('grid_utility', function(){

	it('should_create_grid_with_values_set_to_cell_values',function(){
		var grid = Grid.create(3,3,function(x,y){return 9});
		window.debug = grid;
		expect(grid.length).toEqual(3);
		expect(grid[0].length).toEqual(3);
		expect(grid[0][0]).toEqual(9);
	});
	
	it('should_get_neighboring_cells', function(){
		grid = Mother.unclicked(3,3);
		expect(Grid.neighbors(grid,1,1).length).toEqual(8);
		expect(Grid.neighbors(grid,0,0).length).toEqual(3);
		expect(Grid.neighbors(grid,0,1).length).toEqual(5);
		
		expect(Grid.neighbors(grid,0,1)[0].chance).toEqual(100);
		expect(Grid.neighbors(grid,0,1)[0].state).toEqual('unclicked');
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
		
		it('should_set_probability_of_neighbors', function(){

			grid[1][1] = MineCell(1,0);
			minefield.set_neighbors_chance(1,1);
			expect(grid[0][0].chance).toEqual(1/8);
		});
		
		it('should_set_probability_of_neighbors',function(){
		
		// it('should_not_overwite_a_lesser_probability_cell',function(){
		// 	
		// 	grid[0][0] = MineCell(1,1/8);
		// 	grid[1][1] = MineCell(2,0);
		// 	
		// 	minefield.set_neighbors_chance(1,1);			
		// 	expect(grid[0][0].chance).toEqual(2/8);
		});
		
	});
	
});
