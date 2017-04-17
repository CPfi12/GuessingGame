function generateWinningNumber(){
	var x = Math.floor(100*Math.random())+1;
	return (x===0) ? 1 : x; 
}

function shuffle(array){
	var m = array.length, i, t;
	while(m){
		i = Math.floor(Math.random()*m--);
		t = array[m];
		array[m]=array[i];
		array[i]=t;
	}
	return array;
}

function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess-this.winningNumber);
}
Game.prototype.isLower = function(){
	return (this.playersGuess<this.winningNumber);
}
Game.prototype.playersGuessSubmission = function(guess){
	if((typeof guess)!=='number'||guess<1||guess>100){
		throw 'That is an invalid guess.';
	}
	else{
		this.playersGuess = guess;
		return this.checkGuess();
	}
}
Game.prototype.checkGuess = function(){
	var guess = this.playersGuess;
	if(this.pastGuesses.indexOf(guess)!==-1){
		return 'You have already guessed that number.';
	}
	else{
		this.pastGuesses.push(guess);
		$('#guesslist li:nth-child('+this.pastGuesses.length+')').text(guess);
	}
	if(guess===this.winningNumber){
		$('h2').text('Please reset!')
		$('#submit, #hint').prop('disabled', true);
		return 'You Win!';	
	}
	else if(this.pastGuesses.length===5){
		$('h2').text('Please reset!');
		$('#submit, #hint').prop('disabled', true);
		return 'You Lose.';
	}
	else{
		if(this.isLower())
			$('h2').text('Guess higher!');
		else
			$('h2').text('Guess lower!');
		if(this.difference()<10){
			return 'You\'re burning up!';
		}
		else if(this.difference()<25)
			return 'You\'re lukewarm.';
		else if(this.difference()<50)
			return 'You\'re a bit chilly.';
		else
			return 'You\'re ice cold!';
}
}

function newGame(){
	return new Game();
}

Game.prototype.provideHint = function(){
	var hintarr = [];
	hintarr.push(this.winningNumber);
	for(i=0;i<2;i++)
		hintarr.push(generateWinningNumber())
	return shuffle(hintarr);
}

function getInput(instance){
	var inp = $('#playersinput').val();
    $('#playersinput').val('');
    var y = instance.playersGuessSubmission(+inp);
    $('#title').text(y);
}


$(document).ready(function() {
    var game = new Game();
    $('#submit').click(function(e) {
       getInput(game); 
    })
    $('#playersinput').on('keypress',function(event){
    	if(event.which===13)
    		getInput(game);
    })
    $('#reset').on('click',function(){
    	game = newGame();
    	$('h1').text('Guessing Game!');
    	$('h2').text('Guess a number between 1 and 100');
    	$('li').text('*');
    	$('#submit, #hint').prop('disabled', false); 

    });
    $('#hint').on('click',function(){
    	$('h1').text('One of these is the answer: '+game.provideHint());
    })
});
