describe('minefield',function(){
	
	Mother = (function(){
		return{
			unclicked: function(rows,columns){
				return new Grid(rows,columns,function(){ return MineCell.Create('unclicked',MineCell.UNEVAL)})
			}
		}	
	}());
	
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
		
		it('should_get_next_click_by_the_minimum_cell', function(){
			
			var expected_min_cell = new MineCell('',0);
			spyOn(Grid.prototype, 'min').andReturn(expected_min_cell);
			
			var next_click = minefield.next_click();
			expect(next_click).toEqual(expected_min_cell);
		});
		
		it('should_get_all_unmarked_bombs', function(){
			
			grid.set_cell(0,0,MineCell.Create('unclicked',0));
			grid.set_cell(1,2,MineCell.Create('marked',1));
			grid.set_cell(2,2,MineCell.Create('unclicked',1));
			
			var cells = minefield.get_unmarked_bombs();
			
			expect(cells.length).toEqual(7);
		});
		
		it('should_evaluate_all_cells_neighbors_chance',function(){

			spyOn(minefield, 'set_neighbors_chance').andCallThrough();
			minefield.evaluate_all_cells();
			expect(minefield.set_neighbors_chance.callCount).toEqual(9);
		});
		
	});
	
	describe('when_setting_neighboring_cells_chance',function(){
		
		var grid;
		var minefield;
		
		beforeEach(function(){
			grid = new Grid(3,3,function(){ return MineCell.Create('unclicked',MineCell.UNEVAL)});//Mother.unclicked(3,3);
			minefield = Minefield(grid,1);

		});
		
		it('should_overwrite_when_evaluated_value_is_higher_than_current_value', function(){
			grid.set_cell(0,0,MineCell.Create('unclicked',3/8));
			grid.set_cell(1,1,MineCell.Create(7,0));
						expect(grid.cell(0,1).chance).toEqual(-1)
			minefield.set_neighbors_chance(1,1);

			expect(grid.cell(0,0).chance).toEqual(7/8);
		});

		it('should_not_overwrite_when_evaluated_value_is_lower_current_value',function(){
			
			
			grid.set_cell(0,0,MineCell.Create('unclicked',7/8));
			grid.set_cell(1,1,MineCell.Create(2,0));

			minefield.set_neighbors_chance(1,1);			
			
			expect(grid.cell(0,0).chance).toEqual(7/8);
		});
		
		if('should_not_overwrite_when_current_value_is_zero', function(){
		
			grid.set_cell(0,0,MineCell.Create('unclicked',0));
			grid.set_cell(1,1,MineCell.Create(2,0));

			minefield.set_neighbors_chance(1,1);			
			
			expect(grid.cell(0,0).chance).toEqual(0);
		});
		
		it('should_evaluate_a_marked_cell_as_a_bomb',function(){

			grid.set_cell(0,0,MineCell.Create(1,0));
			grid.set_cell(0,1,MineCell.Create(2,0));
			grid.set_cell(0,2,MineCell.Create(2,0));
			grid.set_cell(1,0,MineCell.Create('marked',0));
			grid.set_cell(1,1,MineCell.Create(1,0));
			grid.set_cell(1,2,MineCell.Create('unclicked',0));
			grid.set_cell(2,0,MineCell.Create(1,0));
			grid.set_cell(2,1,MineCell.Create(1,0));
			grid.set_cell(2,2,MineCell.Create(2,0));
			
			minefield.set_neighbors_chance(1,1,.5);
			
			expect(grid.cell(1,2).chance).toEqual(0);	
		})
		
	})
	
});
