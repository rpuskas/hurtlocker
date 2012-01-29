(function(){

HL = {};
HL.click_cell = function(row,column) {	
	HL.cell_locator(row,column).trigger({
		type: 'mouseup',
		which: 1
	});
};

HL.cell_locator = function(row,column){
	return $("#g1" + "r" + row + "c" + column);
}

HL.refresh_minefield = function(){
	HL.create_minefield(
		$('tr.field').length,
		$('tr.field:first').find('td').length,
		HL.cell_locator);
};

HL.create_minefield = function(rows, columns,cell_locator){
	
	var minefield = Array(rows);
	for(var x = 0;x<rows;x++){
		minefield[x] = Array(columns)
		for(var y = 0;y<columns;y++){
			minefield[x][y] = cell_locator(x,y)
		}
	}
	return minefield;

};

HL.mines_remaining = function(){
	return parseInt($('.minesRemaining').attr('title'));
}

HL.add_if_unclicked = function(total,cell){
	if(cell.attr('class') === 'unclicked'){
		total++;
	}
}

HL.grid_reduce = function(action){
	var total;
	for(row = 0;row < HL.grid_data.rows; row++){
		for(column = 0; column < HL.grid_data.columns; column++){
			action(total,HL.cell_locator(row,column))			
		}
	}
	return total;	
}


}());

$(function(){
	HL.click_cell(0,0);
	HL.refresh_minefield();
});
