$LOAD_PATH << File.dirname(__FILE__)

require 'watir-webdriver'

mine_sweeper_url = 'http://minesweeper.github.com'
browser = Watir::Browser.new

win = 0
loss = 0
ITERATIONS = 25
ITERATIONS.times do

  browser.goto mine_sweeper_url
  sleep 0.4
  browser.execute_script(" 

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


  ")

  sleep 0.5
  status = browser.span(:id,"g1indicator").attribute_value "class"
  puts status
  case status
  when "status dead"
    loss+=1
  when "status won"
    win+=1
  end
  
  sleep 0.6

end

browser.close

puts "You won: #{win} times."
puts "You lost: #{loss} times."
puts "Inconclusive: #{(ITERATIONS - (loss + win))} times"

