const RECTANGLE = 25;
const SCREEN_WIDTH=/*parseInt(prompt("SCREEN_WIDTH"));500*/$(window).width();
const SCREEN_HEIGHT=/*parseInt(prompt("SCREEN_HEIGHT"));500*/$(window).height()-20;
const SPEEDFPS = parseInt(prompt("SPEED"));;
const MARGIN_WIDTH = (SCREEN_WIDTH % RECTANGLE)/2 ;
const MARGIN_HEIGHT = (SCREEN_HEIGHT % RECTANGLE)/2 ;
const PLAY_SCREEN_WIDTH = SCREEN_WIDTH - SCREEN_WIDTH % RECTANGLE;
const PLAY_SCREEN_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT % RECTANGLE;
const SQUARE_H = parseInt( SCREEN_WIDTH / RECTANGLE );
const SQUARE_V = parseInt( SCREEN_HEIGHT / RECTANGLE );

var pause;
var foodX;
var foodY;

var snake={
snakeX : [],
snakeY : [],
speedX : 0,
speedY : 0,
turn : false,
number : 0,
create : function(){
	pause = true;
	this.snakeX = [];
	this.snakeY = [];
	this.snakeX.push(math.randomInt(1,SQUARE_H-1));
	this.snakeY.push(math.randomInt(1,SQUARE_V-1));
	if(math.randomInt(0,2)==0){
		this.speedX = math.randomInt(0,2)*2-1;
		this.speedY = 0;
	}else{
		this.speedX = 0;
		this.speedY=math.randomInt(0,2)*2-1;
	}
	colorRect(this.snakeX[0], this.snakeY[0], 2 + this.number);
},
score : function(){
	stroke(255,0,0);
	fill(255,0,0);
	rect(10+50*this.number, SCREEN_HEIGHT, 20, 20);
	fill(255*this.number,255*this.number,255*((this.number+1)%2));
	text(this.snakeX.length, 10+50*this.number, SCREEN_HEIGHT + 1, 20, 20 );
	stroke(0,0,0);
},
move : function(){
	colorRect(this.snakeX[0], this.snakeY[0], 0);
	this.snakeX.push(this.snakeX[this.snakeX.length-1]+this.speedX);
	this.snakeY.push(this.snakeY[this.snakeY.length-1]+this.speedY);
	if(this.snakeX[this.snakeX.length-1]<SQUARE_H &&
			this.snakeY[this.snakeY.length-1] < SQUARE_V &&
			this.snakeX[this.snakeX.length-1]>-1 &&
			this.snakeY[this.snakeY.length-1] >-1){
		colorRect(this.snakeX[this.snakeX.length-1], this.snakeY[this.snakeY.length-1], 2 + this.number);
		if((this.snakeX[this.snakeX.length-1] == foodX && this.snakeY[this.snakeY.length-1] == foodY)){
			this.score();
			newFood();
			colorRect(this.snakeX[this.snakeX.length-1], this.snakeY[this.snakeY.length-1], 4);
		}else if(isOnSnake(this.snakeX[this.snakeX.length-1],this.snakeY[this.snakeY.length-1], false, this.number)){
			die(this.number);
		}else{
			this.snakeX.splice(0,1);
			this.snakeY.splice(0,1);
		}
	}else{
		die(this.number);
	}
}
};
var snake1= jQuery.extend({}, snake);
snake1.number = 1;

function setup() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT + 20);
	frameRate(SPEEDFPS);
	newLayout();
	snake.create();
	snake1.create();
	snake.score();
	snake1.score();
	newFood(true);
}

function isOnSnake(x,y,isFood, number){
	for(var i = 0;i<snake.snakeX.length-1 || (i<snake.snakeX.length && (isFood || number == 1));i++){
		if(snake.snakeX[i]==x && snake.snakeY[i]==y){
			return true;
		}
	}
	
	for(var i = 0;i<snake1.snakeX.length-1 || (i<snake1.snakeX.length && (isFood || number == 0));i++){
		if(snake1.snakeX[i]==x && snake1.snakeY[i]==y){
			return true;
		}
	}
	return false;
}

function newLayout(){
	background(255,0,0);
	for(var i = 0;i<SQUARE_H;i++){
		for(var j = 0;j<SQUARE_V;j++){
			colorRect(i,j,0);
		}
	}
}


function draw() {
	if(pause==false){
		/*console.log(speedX);
		console.log(speedY);*/
		snake.move();
		snake1.move();
		snake.turn = false;
		snake1.turn = false;
		
		
	}
}

function newFood(){
	foodX = math.randomInt(0,SQUARE_H);
	foodY = math.randomInt(0,SQUARE_V);
	if(isOnSnake(foodX,foodY, true)){
		newFood();
	}else{
		colorRect(foodX, foodY, 1);
	}
}

function die(number){
	scores = [snake.snakeX.length, snake1.snakeX.length];
	scores[number]--;
	number = (number + 1) % 2;
	scores[number] = scores[number] * 2;
	console.log(scores);
	if(scores[0]>scores[1]){
		alert("Game over. Laimėjo mėlynas.");
	}else if(scores[0]==scores[1]){
		scores[(number + 1)%2]++;
		if(scores[0]>scores[1]){
			alert("Game over. Laimėjo mėlynas.");
		} else{
			alert("Game over. Laimėjo geltonas.");
		}
	}
	else{
		alert("Game over. Laimėjo geltonas.");
	}
	newLayout();
	snake.create();
	snake1.create();
	snake.score();
	snake1.score();
	newFood(true);
}

function colorRect(x, y, mode) {
	stroke(255,0,0);
	if(mode==0)
		fill(0,0,0);
	else if(mode==1)
		fill(0,255,0);
	else if(mode==2)
		fill(0,0,255);
	else if(mode==3)
		fill(255,255,0);
	else if(mode==4)
		fill(0,150,255);
	rect(MARGIN_WIDTH + (RECTANGLE * x), MARGIN_HEIGHT + (RECTANGLE * y), RECTANGLE, RECTANGLE);
}

function keyPressed() {
	var cSnake=snake;
	if(!cSnake.turn && !pause){
		cSnake.turn = true;
		if (keyCode === LEFT_ARROW && cSnake.speedX != 1) {
			cSnake.speedX = -1;
			cSnake.speedY = 0;
		} else if (keyCode === RIGHT_ARROW && cSnake.speedX != -1) {
			cSnake.speedX = 1;
			cSnake.speedY = 0;
		} else if (keyCode === UP_ARROW && cSnake.speedY != 1) {
			cSnake.speedX = 0;
			cSnake.speedY = -1;
		} else if (keyCode === DOWN_ARROW && cSnake.speedY != -1) {
			cSnake.speedX = 0;
			cSnake.speedY = 1;
		}else{
			cSnake.turn = false;
		}
	}
}

function keyTyped(){
	var cSnake=snake1;
	if(!cSnake.turn && !pause){
		cSnake.turn = true;
		if (key == "a" && cSnake.speedX != 1) {
			cSnake.speedX = -1;
			cSnake.speedY = 0;
		} else if (key == "d" && cSnake.speedX != -1) {
			cSnake.speedX = 1;
			cSnake.speedY = 0;
		} else if (key == "w" && cSnake.speedY != 1) {
			cSnake.speedX = 0;
			cSnake.speedY = -1;
		} else if (key == "s" && cSnake.speedY != -1) {
			cSnake.speedX = 0;
			cSnake.speedY = 1;
		}else{
			cSnake.turn = false;
		}
	}
	if(key == ' '){
		pause = !pause;
	}
}