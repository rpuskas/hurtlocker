var add_to_page = function(js_url){
	_my_script=document.createElement('SCRIPT'); 
	_my_script.type='text/javascript';
	_my_script.src=js_url;
	document.getElementsByTagName('head')[0].appendChild(_my_script);
}

javascript:(function(){add_to_page('http://dl.dropbox.com/u/41174287/minesweeper/src/minefield.js')})();
setTimeout(function() {
	javascript:(function(){add_to_page('http://dl.dropbox.com/u/41174287/minesweeper/src/main.js')})();
},400);

