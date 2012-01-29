describe('hurt_locker_tests', function(){
		
	it('create_minefield_should_create_data_structure', function() {
		
		var mine_field = HL.create_minefield(2,3,function(){return 'X'});
		expect(mine_field.length).toEqual(2);
		expect(mine_field[1].length).toEqual(3);
		expect(mine_field[1][2]).toEqual('X');
		
	});
	
});
