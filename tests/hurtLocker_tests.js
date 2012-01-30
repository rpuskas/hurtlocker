describe('hurt_locker_tests', function(){
		
	it('create_minefield_should_create_data_structure', function() {
		
		spyOn(HL, 'cell_locator').andReturn('X');
		var mine_field = HL.create_minefield(3,3,HL.cell_locator);
		expect(HL.cell_locator.callCount).toEqual(3*3);
		expect(mine_field[0][0]).toEqual('X');
		expect(mine_field[2][2]).toEqual('X');
		
	});
	
	it('should_translate_cell_class_value_into_grid_value', function(){
		
		expect(HL.cell_value('unclicked')).toEqual('unclicked');
		expect(HL.cell_value('mines1')).toEqual('1');
		expect(HL.cell_value('mines2')).toEqual('2');
		expect(HL.cell_value('mines3')).toEqual('3');
		expect(HL.cell_value('mines4')).toEqual('4');
		expect(HL.cell_value('mines5')).toEqual('5');
		expect(HL.cell_value('mines6')).toEqual('6');
		expect(HL.cell_value('marked')).toEqual('marked');
		
	});
	
});
