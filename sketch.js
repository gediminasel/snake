const RECTANGLE = 25;
const SCREEN_WIDTH=1300;
const SCREEN_HEIGHT=650;
const SPEEDFPS = 10;
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
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
	frameRate(SPEEDFPS);
	background(255,0,0);
	for(var i = 0;i<SQUARE_H;i++){
		for(var j = 0;j<SQUARE_V;j++){
			colorRect(i,j,0);
		}
	}
	newFood(false);
	newSnake();	
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
}

function draw() {
	if(pause==false){
		/*console.log(speedX);
		console.log(speedY);*/
		moveSnake();
		turn = false;
		
		
	}
}

function newFood(isFirst){
	if(!isFirst){
		colorRect(foodX, foodY, 0);
	}
	foodX = math.randomInt(0,SQUARE_H);
	foodY = math.randomInt(0,SQUARE_V);
	
	colorRect(foodX, foodY, 1);
}

function moveSnake(){
	colorRect(snakeX[0], snakeY[0], 0);
	snakeX.push(snakeX[snakeX.length-1]+speedX);
	snakeY.push(snakeY[snakeY.length-1]+speedY);
	if(snakeX[snakeX.length-1]<SQUARE_H && snakeY[snakeY.length-1] < SQUARE_V && snakeX[snakeX.length-1]>-1 && snakeY[snakeY.length-1] >-1){
		colorRect(snakeX[snakeX.length-1], snakeY[snakeY.length-1], 2);
		if(!(snakeX[0] == foodX && snakeY[0] == foodY)){
			colorRect(snakeX[0], snakeY[0], 0);
			snakeX.splice(0,1);
			snakeY.splice(0,1);
		}else
			newFood();
	}else{
		newSnake();
		pause = true;
	}
}

function deleteSnake(){
	while(snakeX.length>0){
			colorRect(snakeX[0], snakeY[0], 0);
			snakeX.splice(0,1);
			snakeY.splice(0,1);
	}
}

function colorRect(x, y, mode) {
	if(mode==0)
		fill(0,0,0);
	else if(mode==1)
		fill(0,255,0);
	else if(mode==2)
		fill(0,0,255);
	rect(MARGIN_WIDTH + (RECTANGLE * x), MARGIN_HEIGHT + (RECTANGLE * y), RECTANGLE - 2, RECTANGLE - 2);
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