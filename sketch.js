const RECTANGLE = 25;
const SCREEN_WIDTH=parseInt(prompt("SCREEN_WIDTH"));
const SCREEN_HEIGHT=parseInt(prompt("SCREEN_HEIGHT"));
const SPEEDFPS = parseInt(prompt("SPEED"));
const MARGIN_WIDTH = (SCREEN_WIDTH % RECTANGLE)/2 ;
const MARGIN_HEIGHT = (SCREEN_HEIGHT % RECTANGLE)/2 ;
const PLAY_SCREEN_WIDTH = SCREEN_WIDTH - SCREEN_WIDTH % RECTANGLE;
const PLAY_SCREEN_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT % RECTANGLE;
const SQUARE_H = parseInt( SCREEN_WIDTH / RECTANGLE );
const SQUARE_V = parseInt( SCREEN_HEIGHT / RECTANGLE );

var pause;
var foodX;
var foodY;
var snakeX;
var snakeY;
var speedX;
var speedY;
var turn = false;

function setup() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT + 20);
	frameRate(SPEEDFPS);
	newLayout();
	newSnake();
	score();
}

function newLayout(){
	background(255,0,0);
	for(var i = 0;i<SQUARE_H;i++){
		for(var j = 0;j<SQUARE_V;j++){
			colorRect(i,j,0);
		}
	}
}

function newSnake(){
	pause = true;
	snakeX = [];
	snakeY = [];
	snakeX.push(math.randomInt(1,SQUARE_H-1));
	snakeY.push(math.randomInt(1,SQUARE_V-1));
	if(math.randomInt(0,2)==0){
		speedX = math.randomInt(0,2)*2-1;
		speedY = 0;
	}else{
		speedX = 0;
		speedY=math.randomInt(0,2)*2-1;
	}
	colorRect(snakeX[0], snakeY[0], 2);
	newFood(true);
}

function draw() {
	if(pause==false){
		/*console.log(speedX);
		console.log(speedY);*/
		moveSnake();
		turn = false;
		
		
	}
}

function isOnSnake(x,y,isFood){
	for(var i = 0;i<snakeX.length-1 || (i<snakeX.length && isFood);i++){
		if(snakeX[i]==x && snakeY[i]==y){
			console.log(x);
			console.log(y);
			return true;
		}
	}
	return false;
}

function newFood(isNew){
	if(isNew){
		foodX = snakeX[0]+speedX;
		foodY = snakeY[0]+speedY;
	}else{
		foodX = math.randomInt(0,SQUARE_H);
		foodY = math.randomInt(0,SQUARE_V);
	}
	if(isOnSnake(foodX,foodY, true)){
		newFood();
	}else{
		colorRect(foodX, foodY, 1);
	}
}

function score(){
	stroke(255,0,0);
	fill(255,0,0);
	rect(10, SCREEN_HEIGHT, 20, 20);
	fill(0,255,0);
	text(snakeX.length, 10, SCREEN_HEIGHT + 1, 20, 20 );
	stroke(0,0,0);
}

function moveSnake(){
	snakeX.push(snakeX[snakeX.length-1]+speedX);
	snakeY.push(snakeY[snakeY.length-1]+speedY);
	if(snakeX[snakeX.length-1]<SQUARE_H && snakeY[snakeY.length-1] < SQUARE_V && snakeX[snakeX.length-1]>-1 && snakeY[snakeY.length-1] >-1){
		colorRect(snakeX[snakeX.length-1], snakeY[snakeY.length-1], 2);
		if((snakeX[snakeX.length-1] == foodX && snakeY[snakeY.length-1] == foodY)){
			score();
			newFood();
			colorRect(snakeX[snakeX.length-1], snakeY[snakeY.length-1], 3);
		}else if(isOnSnake(snakeX[snakeX.length-1],snakeY[snakeY.length-1], false)){
			die();
		}else{
			colorRect(snakeX[0], snakeY[0], 0);
			snakeX.splice(0,1);
			snakeY.splice(0,1);
		}
	}else{
		die();
	}
}

function die(){
	alert(snakeX.length-1);
	newLayout();
	newSnake();
	turn = true;
	score();
}

function deleteSnake(){
	while(snakeX.length>0){
		colorRect(snakeX[0], snakeY[0], 0);
		snakeX.splice(0,1);
		snakeY.splice(0,1);
	}
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
		fill(0,100,255);
	rect(MARGIN_WIDTH + (RECTANGLE * x), MARGIN_HEIGHT + (RECTANGLE * y), RECTANGLE, RECTANGLE);
}

function keyPressed() {
	if(!turn){
		turn = true;
		if (keyCode === LEFT_ARROW && speedX != 1) {
			speedX = -1;
			speedY = 0;
		} else if (keyCode === RIGHT_ARROW && speedX != -1) {
			speedX = 1;
			speedY = 0;
		} else if (keyCode === UP_ARROW && speedY != 1) {
			speedX = 0;
			speedY = -1;
		} else if (keyCode === DOWN_ARROW && speedY != -1) {
			speedX = 0;
			speedY = 1;
		}else{
			turn = false;
		}
	}
	if(key == ' '){
		pause = !pause;
	}
}