$(function(){
	
	var counter = 0;
	var run_until_solved = function(){
		
		var mines_remaining = parseInt($('#g1minesRemaining').attr('title'));
		
		var minefield = new Minefield(HL.refresh(),mines_remaining);
		var x = minefield.next_click();
		
		var next = Grid.find(minefield.data,x)
		HL.click_cell(next.x,next.y);
		
		if($('#g1indicator').attr('class') === 'status alivePressed') return;
		if(minefield.unclickedSquares === $('#g1minesRemaining').attr('title')) return;
	}
	
	run_until_solved();	
	
});
