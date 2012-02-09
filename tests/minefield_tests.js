Mother = (function(){
	return{
		unclicked: function(rows,columns){
			return new Grid(rows,columns,function(){ return {state:'unclicked',chance:100}})
		}
	}	
	
}());

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
			console.log(grid);
		});
		
		it('should_overwrite_neighboring_cells_probability_when_cacluated_value_is_higher_than_random_chance', function(){
			grid.set_cell(0,0,MineCell('unclicked',0));
			grid.set_cell(1,1,MineCell(7,0));
			
			var random_chance = .2;
			minefield.set_neighbors_chance(1,1,random_chance);
			
			expect(grid.cell(0,0).chance).toEqual(7/8);
		});
		
		it('should_not_overwrite_neighboring_cells_probability_when_cacluated_value_is_lower_than_random_chance',function(){
			
			grid.set_cell(0,0,MineCell('unclicked',0));
			grid.set_cell(1,1,MineCell(2,0));
			
			random_chance = .5;
			minefield.set_neighbors_chance(1,1,.5);			
			expect(grid.cell(0,0).chance).toEqual(.5);
		});
		
		it('should_evaluate_all_cells_neighbors_chance',function(){
			
			spyOn(minefield, 'set_neighbors_chance').andCallThrough();
			
			minefield.evaluate_all_cells();
			
			expect(minefield.set_neighbors_chance.callCount).toEqual(9);
			
		});
		
		it('should_get_next_click_by_the_minimum_cell', function(){
			
			var expected_min_cell = MineCell(0,0);
			spyOn(Grid.prototype, 'min').andReturn(expected_min_cell);
			
			var next_click = minefield.next_click();
			expect(next_click).toEqual(expected_min_cell);
		});
		
		it('should_get_all_unmarked_bombs', function(){
			
			grid.set_cell(0,0,MineCell('unclicked',0));
			grid.set_cell(1,2,MineCell('marked',1));
			grid.set_cell(2,2,MineCell('unclicked',1));
			
			var cells = minefield.get_unmarked_bombs();
			expect(cells.length).toEqual(7);
			
		});
		
	});
	
});
