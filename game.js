window.addEventListener('load',init,false);

var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasShooter = document.getElementById('canvasShooter');
var ctxShooter = canvasShooter.getContext('2d');
var canvasHud = document.getElementById('canvasHud');
var ctxHud = canvasHud.getContext('2d');
var canvasWarningHud = document.getElementById('warningHud');
var ctxWarningHud = canvasWarningHud.getContext('2d');
var canvasBoss = document.getElementById('canvasBoss');
var ctxBoss = canvasBoss.getContext('2d');

var canvasBullets = document.getElementById('canvasBullets');
var ctxBullets = canvasBullets.getContext('2d');

var canvasRadiation = document.getElementById('canvasRadiation');
var ctxRadiation = canvasRadiation.getContext('2d');



ctxHud.fillText("Sample String", 10, 50);
var warningHudText = '';
var bullets = [];
var totalBullets = 0;
var spawnedBullets = 0;
var spawnRate = 35;
var spawnAmount = 1;
var spawnInterval;
var score = 0;
var phaseInterval;
	var hud1 = new Hud();
	var warninghud1 = new WarningHud();
	var shooter1 = new Shooter();
	var boss1 = new Boss();
	var radiation = new Radiation();


var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;


var colorStops = new Array(
 {color:"#FF0000", stopPercent:0},
 {color:"#FFFF00", stopPercent:.125},
 {color:"#00FF00", stopPercent:.375},
 {color:"#0000FF", stopPercent:.625},
 {color:"#FF00FF", stopPercent:.875},
 {color:"#FF0000", stopPercent:1});

var gradient = ctxShooter.createLinearGradient(gameWidth/2,0,gameWidth/2,gameHeight);
function randomColors (){
for (var i=0; i < colorStops.length; i++) {     
   var tempColorStop = colorStops[i];     
   var tempColor = tempColorStop.color;     
   var tempStopPercent = tempColorStop.stopPercent;     
   gradient.addColorStop(tempStopPercent,tempColor);    
   tempStopPercent += .1;     
   if (tempStopPercent > 1) {
       tempStopPercent = 0;
   }
   tempColorStop.stopPercent = tempStopPercent;;
   colorStops[i] = tempColorStop;
 }
}
var isPlaying = false;
var scoreCheck = false;
var requestAnimFrame =  window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						window.oRequestAnimationFrame;		
	
//init 

function init() {
	randomColors();
	startLoop();
	startSpawningBullets();
	document.addEventListener('keydown',checkKeyDown,false);
	document.addEventListener('keyup',checkKeyUp,false);
}

function spawnBullets(n) {

	for (var i=0; i<n; i++) {
		bullets[totalBullets] = new Bullets();
		totalBullets++;
		spawnedBullets ++;
	}
}


function startPhaseInterval() {
	phaseInterval = setInterval(function() {checkPhase()},10000);
}
function checkPhase () {
	if (phase===1) {
		setTimeout(function() {
			warningHudText = "TRIANGLE GOES IMBA!!!!"
			setTimeout(function() {phase = 2; warningHudText = '' }, 4000);
		}, 3000)

	} else if (phase === 2){
		phase = 1;
	}
}

function stopPhaseInterval() {
	clearInterval(phaseInterval);
}
function drawAllBullets() {
	clearCtxBullets();
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].draw();
	}
}

function startSpawningBullets() {

	stopSpawningBullets();
	stopPhaseInterval();
	phase=1;
	score=0;
	warningHudText='';
	startPhaseInterval();
	scoreCheck=true;
	spawnInterval = setInterval(function() {spawnBullets(spawnAmount)}, spawnRate);
}

function stopSpawningBullets() {
	clearInterval(spawnInterval);
}

//main
function loop() {
	if (isPlaying) {
		hud1.draw();
		warninghud1.draw();
		shooter1.draw();
		boss1.draw();
		checkScore();
		drawAllBullets();
		radiation.draw();

		requestAnimFrame(loop);
	}
}

function startLoop() {
	isPlaying = true;
	loop();
}

function stopLoop() {
	isPlaying = false;
}


//update score 

function checkScore(){
	if (scoreCheck){

	if ((shooter1.drawX>=gameWidth/2-(0.5)*boss1.width) && (shooter1.drawX<=gameWidth/2+(0.5)*boss1.width)){
		if (shooter1.drawY<=gameHeight/4) score = score + 15; 
		 else if (shooter1.drawY<=gameHeight/2) score = score +5;
		 else score ++;
	}
}
}


//hud
function Hud() {

}
Hud.prototype.draw = function() {
	clearCtxHud();
	ctxHud.fillStyle = 'white';
	ctxHud.font = '12px Arial'
	ctxHud.fillText(score, 10, 25);
}
function clearCtxHud() {
	ctxHud.clearRect(0,0,gameWidth,gameHeight);
}

//harninghud
function WarningHud() {

}
WarningHud.prototype.draw = function() {
	clearCtxWarningHud();
	ctxWarningHud.fillText(warningHudText, gameWidth/2 - 120, 120);
	ctxWarningHud.fillStyle = 'red';
	ctxWarningHud.font = 'bold 22px Arial';
}
function clearCtxWarningHud() {
	ctxWarningHud.clearRect(0,0,gameWidth,gameHeight);
}


//shooter
function Shooter() {
	this.drawX = 190;
	this.drawY = 480;
	this.width = 20;
	this.height = 20;
	this.speed = 3;
	this.isLeftKey = false;
	this.isRightKey = false;
	this.radius = 2;

}



Shooter.prototype.draw = function() {
	clearCtxShooter();
	this.checkKeys();
	ctxShooter.fillStyle='#f11';
	ctxShooter.beginPath();
	ctxShooter.arc(this.drawX, this.drawY, this.radius, 0, 2 * Math.PI, false);
	ctxShooter.fill();

}

function clearCtxShooter() {
	ctxShooter.clearRect(0,0,gameWidth,gameHeight);
}

Shooter.prototype.checkKeys = function(){
	if (this.isRightKey && this.drawX < gameWidth-2){
		this.drawX += this.speed;
	} 
	if (this.isLeftKey && this.drawX > 2){
		this.drawX -= this.speed;
	}
	if (this.isUpKey && this.drawY > 0){
		this.drawY -= this.speed;
	}
	if (this.isDownKey && this.drawY < gameHeight){
		this.drawY += this.speed;
	}
}

//radiation
function Radiation() {

}
	var imageObj = new Image();
	imageObj.src='radiation.png';
Radiation.prototype.draw = function() {
	clearCtxRadiation();


	ctxRadiation.drawImage(imageObj, shooter1.drawX-108, 0);
}
function clearCtxRadiation() {
	ctxRadiation.clearRect(0,0,gameWidth,gameHeight);
}



//boss
function Boss() {
	this.drawX = 190;
	this.drawY = 0;
	this.width = 100;
	this.height = 50;
	this.speed = 2;
	this.isLeftKey = false;
	this.isRightKey = false;
}

Boss.prototype.draw = function() {
	clearCtxBoss();
	ctxBoss.fillStyle=gradient;


	ctxBoss.beginPath();
    ctxBoss.moveTo(gameWidth/2-(0.5)*this.width,0);
    ctxBoss.lineTo(gameWidth/2,this.height);
    ctxBoss.lineTo(gameWidth/2+(0.5)*this.width,0);
    ctxBoss.closePath();


    ctxBoss.fill();



}

function clearCtxBoss() {
	ctxBoss.clearRect(0,0,gameWidth,gameHeight);
}

//bullets

angle=0;
var angleDirection='left';
function Bullets() {
	this.drawX = gameWidth/2;
	this.drawY = 48;
	this.speed = 2;
	this.angle = angle;
	this.bulletRadius=2;
   this.radians = this.angle * Math.PI / 180;

}

Bullets.prototype.draw = function() {
		if (angle>60){
			angleDirection = 'right';
		}
		if (angle<-60) angleDirection = 'left';

		if (angleDirection==='left') angle=angle+0.1;
		if (angleDirection==='right') angle=angle-0.1;
		
 		this.drawY = this.drawY + Math.cos(this.radians) * this.speed;
		this.drawX = this.drawX + Math.sin(this.radians) * this.speed;

		ctxBullets.fillStyle='#fff';
		ctxBullets.beginPath();
		ctxBullets.arc(this.drawX, this.drawY, this.bulletRadius, 0, 2 * Math.PI, false);
		if (phase === 2) { this.bulletRadius = this.bulletRadius + 0.4; ctxBullets.fillStyle='#f11';}
	    ctxBullets.fill();
	    this.checkEscaped();

	   //check collisiond
//
	   	if (this.drawX <= shooter1.drawX + this.bulletRadius + 2 &&
	   		this.drawX >= shooter1.drawX - this.bulletRadius - 2 &&
	   		this.drawY <= shooter1.drawY + this.bulletRadius + 2 &&
	   		this.drawY >= shooter1.drawY - this.bulletRadius - 2 || 
			(

	   		((shooter1.drawX>=gameWidth/2-(0.5)*boss1.width) && 
	   		(shooter1.drawX<=gameWidth/2+(0.5)*boss1.width)) &&
	   		(shooter1.drawY>=0) && 
	   		(shooter1.drawY<=boss1.height) 

	   		)
	   		)
	   	{
	   		stopSpawningBullets();
	   		stopPhaseInterval();
	   		scoreCheck=false;
	   		warningHudText='GAME OVER! Score: ' + score;
	   		setTimeout(function() {startSpawningBullets()}, 10000);

	   	} 
	    
}

Bullets.prototype.checkEscaped = function () {
	if (this.drawY - gameHeight >= 200 ) {
		this.destroyBullet();
	}
}

Bullets.prototype.destroyBullet = function() {
	bullets.splice(bullets.indexOf(this),1);
	totalBullets--;
}

function clearCtxBullets() {
	ctxBullets.clearRect(0,0,gameWidth,gameHeight);
}

//key hooks
function checkKeyDown(e) {
	var keyID = e.keyCode || e.which;
	if (keyID === 38 || keyID === 87) { //up || w
		shooter1.isUpKey = true;
		e.preventDefault();
	}
	if (keyID === 39|| keyID === 68) { //right || d
		shooter1.isRightKey = true;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83) { //down || s
		shooter1.isDownKey = true;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65) { //left || a
		shooter1.isLeftKey = true;
		e.preventDefault();
	}
}

function checkKeyUp(e) {
	var keyID = e.keyCode || e.which;
	if (keyID === 38 || keyID === 87) { //up || w
		shooter1.isUpKey = false;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68) { //right || d
		shooter1.isRightKey = false;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83) { //down || s
		shooter1.isDownKey = false;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65) { //left || a
		shooter1.isLeftKey = false;
		e.preventDefault();
	}
}