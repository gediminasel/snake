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
var mRemove = false;
var backgroundColor, strokeColor, foodColor;
var colors;
var lastAlive;

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
	stroke(backgroundColor);
	fill(backgroundColor);
	rect(10+50*this.number, SCREEN_HEIGHT, 20, 20);
	fill(colors[this.number]);
	text(this.snakeX.length, 10+50*this.number, SCREEN_HEIGHT + 1, 20, 20 );
	stroke(strokeColor);
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
	backgroundColor = color(0,0,0);
	strokeColor = color(255,255,255);
	foodColor = color(155,155,155);
	colors = [color(0,0,255),color(0,255,0),color(255,0,0),color(0,255,255),color(255,0,255),color(255,255,0)];
	while(SPEEDFPS<=0 || isNaN(SPEEDFPS)){
		SPEEDFPS = prompt("SPEED");
		if(SPEEDFPS==null){
			mRemove=true;
			return;
		}
		SPEEDFPS = parseInt(SPEEDFPS);
	}
	
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT + 20);
	frameRate(SPEEDFPS);
	
	while(count > 6 || count < 2 || isNaN(count)){
		count = prompt("Įveskite žaidėjų kiekį:");
		if(count==null){
			mRemove=true;
			return;
		}
		count = parseInt(count);
	}
	
	newLayout();
	
	for(var i = 0;i<count;i++){
		snakes.push(jQuery.extend({number : i}, snake));
	}
	
	for(var i = 0;i<count;i++){
		var x = "";
		while(x.split('').length!=2){
			x = prompt("Įveskite " + (i + 1).toString() + " žaidėjo valdymus į kairę ir į dešinę (du simboliai)");
			if(x==null){
				mRemove=true;
				return;
			}
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
	background(backgroundColor);
	for(var i = 0;i<SQUARE_H;i++){
		for(var j = 0;j<SQUARE_V;j++){
			colorRect(i,j,0);
		}
	}
}

function draw() {
	if(mRemove){
		remove();
	}
	ended++;
	console.log("draw");
	if(pause==false){
		for(var i = 0;i<count;i++){
			snakes[i].turn=false;
			var index = nowDied.indexOf(i);
			if(index!=-1)
				nowDied.splice(index, i);
			if(!pause){
				if(!snakes[i].died)
					snakes[i].move();
			}
			else
				return;
		}	
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
			var winners = "Laimėjo ";
			if(countAlive == 1){
				winners = winners + (lastInd + 1).toString() + " žaidėjas.";
			}else{
				for(var i = 0;i<lastAlive.length;i++){
					winners = winners + (lastAlive[i] + 1).toString() + " ";
				}
				winners = winners + "žaidėjai."
			}
			alert(winners);
			newLayout();
			for(var i = 0;i<count;i++){
				snakes[i].create();
			}
			for(var i = 0;i<count;i++){
				snakes[i].score();
			}
			newFood(true);
			nowDied = [];
		}else{
			lastAlive = [];
			for(var i = 0;i<count;i++){
				if(!snakes[i].died){
					lastAlive.push(i);
				}
			}
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
	

}

function colorRect(x, y, mode, isOnFood = false) {
	if(x>=0 && y>=0 && x < SQUARE_H && y < SQUARE_V){
		stroke(strokeColor);
		if(mode==0)
			fill(backgroundColor);
		else if(mode==1)
			fill(foodColor);
		else {
			if(isOnFood){
				fill(parseInt(red(colors[mode-2])/2),parseInt(green(colors[mode-2])/2),parseInt(blue(colors[mode-2])/2));
			}else{
				fill(colors[mode-2]);
			}
		}
		rect(MARGIN_WIDTH + (RECTANGLE * x), MARGIN_HEIGHT + (RECTANGLE * y), RECTANGLE, RECTANGLE);
	}
}

function colorEllipse(x, y, mode){
	console.log("colorEllipse");
	stroke(strokeColor);
	fill(colors[mode]);
	ellipse(MARGIN_WIDTH + (RECTANGLE * (x + 0.5)), MARGIN_HEIGHT + (RECTANGLE * (y + 0.5)), RECTANGLE*2/5, RECTANGLE*2/5);
}

function keyTyped(){
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
