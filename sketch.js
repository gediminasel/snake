const RECTANGLE = 30;
const SCREEN_WIDTH=/*parseInt(prompt("SCREEN_WIDTH"));500*/$(window).width();
const SCREEN_HEIGHT=/*parseInt(prompt("SCREEN_HEIGHT"));500*/$(window).height()-20;
const MARGIN_WIDTH = (SCREEN_WIDTH % RECTANGLE)/2 ;
const MARGIN_HEIGHT = (SCREEN_HEIGHT % RECTANGLE)/2 ;
const PLAY_SCREEN_WIDTH = SCREEN_WIDTH - SCREEN_WIDTH % RECTANGLE;
const PLAY_SCREEN_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT % RECTANGLE;
const SQUARE_H = parseInt( SCREEN_WIDTH / RECTANGLE );
const SQUARE_V = parseInt( SCREEN_HEIGHT / RECTANGLE );
var SPEEDFPS = 0;
var ADD_AFTER = 50;

var pause;
var foodX;
var foodY;
var snakes = [];
var count = 0;
var nowDied = [];
var ended = 0;

function newColor(a,b,c){
	this.a = a;
	this.b = b;
	this.c = c;
}

var colors = [new newColor(0,0,255),new newColor(0,255,0),new newColor(255,0,0),new newColor(0,255,255),new newColor(255,0,255),new newColor(255,255,0)];
var backgroundColor = new newColor(0,0,0);
var strokeColor = new newColor(255,255,255);
var foodColor = new newColor(155,155,155);

var snake={
controls : [],
speedXFirst : 0,
speedYFirst : 0,
snakeX : [],
snakeY : [],
speedX : 0,
speedY : 0,
turn : false,
died : false,
create : function(){
	console.log("create");
	this.died = false;
	this.snakeX = [];
	this.snakeY = [];
	this.snakeX.push(math.randomInt(2,SQUARE_H-2));
	this.snakeY.push(math.randomInt(2,SQUARE_V-2));
	if(math.randomInt(0,2)==0){
		this.speedX = math.randomInt(0,2)*2-1;
		this.speedY = 0;
	}else{
		this.speedX = 0;
		this.speedY=math.randomInt(0,2)*2-1;
	}
	colorRect(this.snakeX[0], this.snakeY[0], 2 + this.number);	
	colorEllipse(this.snakeX[0] + this.speedX, this.snakeY[0] + this.speedY, this.number);
	this.speedXFirst=this.speedX;
	this.speedYFirst=this.speedY;
},
score : function(){
	console.log("score");
	stroke(backgroundColor.a,backgroundColor.b,backgroundColor.c);
	fill(backgroundColor.a,backgroundColor.b,backgroundColor.c);
	rect(10+50*this.number, SCREEN_HEIGHT, 20, 20);
	fill(parseInt(colors[this.number].a),parseInt(colors[this.number].b),parseInt(colors[this.number].c));
	text(this.snakeX.length, 10+50*this.number, SCREEN_HEIGHT + 1, 20, 20 );
	stroke(strokeColor.a,strokeColor.b,strokeColor.c);
},
move : function(){
	console.log("move");
	if(this.speedXFirst != 0 || this.speedYFirst != 0){
		colorRect(this.snakeX[0] + this.speedXFirst, this.snakeY[0] + this.speedYFirst, 0);
		this.speedYFirst = 0;
		this.speedXFirst = 0;
	}
	colorRect(this.snakeX[0], this.snakeY[0], 0);
	this.snakeX.push(this.snakeX[this.snakeX.length-1]+this.speedX);
	this.snakeY.push(this.snakeY[this.snakeY.length-1]+this.speedY);
	if(this.snakeX[this.snakeX.length-1] < SQUARE_H &&
			this.snakeY[this.snakeY.length-1] < SQUARE_V &&
			this.snakeX[this.snakeX.length-1] > -1 &&
			this.snakeY[this.snakeY.length-1] > -1){
		colorRect(this.snakeX[this.snakeX.length-1], this.snakeY[this.snakeY.length-1], 2 + this.number);
		if((this.snakeX[this.snakeX.length-1] == foodX && this.snakeY[this.snakeY.length-1] == foodY) || ended == ADD_AFTER){
			this.score();
			if((this.snakeX[this.snakeX.length-1] == foodX && this.snakeY[this.snakeY.length-1] == foodY))
				newFood();
			colorRect(this.snakeX[this.snakeX.length-1], this.snakeY[this.snakeY.length-1], this.number+2, true);
		}else if(isOnSnake(this.snakeX[this.snakeX.length-1],this.snakeY[this.snakeY.length-1], false, this.number)){
			die(this.number);
		}else{
			this.snakeX.splice(0,1);
			this.snakeY.splice(0,1);
		}
	}else{
		die(this.number);
	}
},
remove : function(){
	console.log("remove");
	for(var i = 0;i<this.snakeX.length;i++){
		colorRect(this.snakeX[i], this.snakeY[i], 0);
	}
}
};

function setup() {
	console.log("setup");
	while(SPEEDFPS<=0 || isNaN(SPEEDFPS)){
		SPEEDFPS = parseInt(prompt("SPEED"));
	}
	
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT + 20);
	frameRate(SPEEDFPS);
	
	while(count > 6 || count < 2 || isNaN(count)){
		count = parseInt(prompt("Įveskite žaidėjų kiekį:"));
	}
	
	newLayout();
	
	for(var i = 0;i<count;i++){
		snakes.push(jQuery.extend({number : i}, snake));
	}
	
	for(var i = 0;i<count;i++){
		var x = "";
		while(x.split('').length!=2){
			x = prompt("Įveskite " + (i + 1).toString() + " žaidėjo valdymus į kairę ir į dešinę (du simboliai)");
		}
		snakes[i].controls = x.split('');
	}
	
	for(var i = 0;i<count;i++){
		snakes[i].create();
	}
	for(var i = 0;i<count;i++){
		snakes[i].score();
	}
	newFood(true);
	ADD_AFTER = 3 * SPEEDFPS;
}

function isOnSnake(x,y,isFood, number){
	console.log("isOnSnake");
	for(var j = 0;j<count;j++){
		if(snakes[j].died && -1==nowDied.indexOf(j)){
			continue;
		}
		for(var i = 0;i<snakes[j].snakeX.length-1 || (i<snakes[j].snakeX.length && (isFood || number != j));i++){
			if(snakes[j].snakeX[i]==x && snakes[j].snakeY[i]==y){
				return true;
			}
		}
	}
	
	return false;
}

function newLayout(){
	console.log("newLayout");
	background(backgroundColor.a,backgroundColor.b,backgroundColor.c);
	for(var i = 0;i<SQUARE_H;i++){
		for(var j = 0;j<SQUARE_V;j++){
			colorRect(i,j,0);
		}
	}
}

function draw() {
	ended++;
	console.log("draw");
	nowDied = [];
	if(pause==false){
		for(var i = 0;i<count;i++){
			snakes[i].turn=false;
		}
		for(var i = 0;i<count;i++){
			if(!pause){
				if(!snakes[i].died)
					snakes[i].move();
			}
			else
				return;
		}
	}
	if(ended>=ADD_AFTER){
		ended=0;
	}
}

function newFood(){
	console.log("newFood");
	foodX = math.randomInt(0,SQUARE_H);
	foodY = math.randomInt(0,SQUARE_V);
	if(isOnSnake(foodX,foodY, true)){
		newFood();
	}else{
		colorRect(foodX, foodY, 1);
	}
}

function die(number){
	console.log("die");
	nowDied.push(number);
	snakes[number].remove();
	snakes[number].died = true;
	
	var countAlive = 0;
	var lastInd = -1;
	for(var i = 0;i<count;i++){
		if(!snakes[i].died){
			countAlive++;
			lastInd=i;
		}
	}
	if(countAlive<=1){
		pause = true;
		/*var maxInd = 0;
		for(var i = 1;i<count;i++){
			if(snakes[maxInd].snakeX.length<snakes[i].snakeX.length){
				maxInd=i;
			}
		}*/
		alert("Laimėjo "+(lastInd + 1).toString()+" žaidėjas.");
		newLayout();
		for(var i = 0;i<count;i++){
			snakes[i].create();
		}
		for(var i = 0;i<count;i++){
			snakes[i].score();
		}
		newFood(true);
		nowDied = [];
	}
}

function colorRect(x, y, mode, isOnFood = false) {
	if(x>=0 && y>=0 && x < SQUARE_H && y < SQUARE_V){
		stroke(strokeColor.a,strokeColor.b,strokeColor.c);
		if(mode==0)
			fill(backgroundColor.a,backgroundColor.b,backgroundColor.c);
		else if(mode==1)
			fill(foodColor.a,foodColor.b,foodColor.c);
		else {
			if(isOnFood){
				fill(parseInt(colors[mode-2].a/2),parseInt(colors[mode-2].b/2),parseInt(colors[mode-2].c/2));
			}else{
				fill(parseInt(colors[mode-2].a),parseInt(colors[mode-2].b),parseInt(colors[mode-2].c));
			}
		}
		rect(MARGIN_WIDTH + (RECTANGLE * x), MARGIN_HEIGHT + (RECTANGLE * y), RECTANGLE, RECTANGLE);
	}
}

function colorEllipse(x, y, mode){
	console.log("colorEllipse");
	stroke(strokeColor.a,strokeColor.b,strokeColor.c);
	fill(parseInt(colors[mode].a),parseInt(colors[mode].b),parseInt(colors[mode].c));
	ellipse(MARGIN_WIDTH + (RECTANGLE * (x + 0.5)), MARGIN_HEIGHT + (RECTANGLE * (y + 0.5)), RECTANGLE*2/5, RECTANGLE*2/5);
}/*

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
}*/

function keyTyped(){
	/*var cSnake=snake1;
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
	}*/
	if(key == ' '){
		pause = !pause;
	}
	if(!pause){
		for(var i = 0;i<count;i++){
			if(!snakes[i].turn){
				if (key == snakes[i].controls[0]) {
					if (snakes[i].speedX != 0) {
						snakes[i].speedY = -1*snakes[i].speedX;
						snakes[i].speedX = 0;
					} else {
						snakes[i].speedX = snakes[i].speedY;
						snakes[i].speedY = 0;
					}
					snakes[i].turn=true;
				} else if (key == snakes[i].controls[1]) {
					if (snakes[i].speedX != 0) {
						snakes[i].speedY = snakes[i].speedX;
						snakes[i].speedX = 0;
					} else {
						snakes[i].speedX = -1*snakes[i].speedY;
						snakes[i].speedY = 0;
					}
					snakes[i].turn=true;
				}
			}
		}
	}
}