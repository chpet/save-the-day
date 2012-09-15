window.addEventListener('load',init,false);

var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');

var canvasShooter = document.getElementById('canvasShooter');
var ctxShooter = canvasShooter.getContext('2d');

var canvasHud = document.getElementById('canvasHud');
var ctxHud = canvasHud.getContext('2d');

var canvasMultiplier = document.getElementById('canvasMultiplier');
var ctxMultiplier = canvasMultiplier.getContext('2d');

var canvasWarningHud = document.getElementById('warningHud');
var ctxWarningHud = canvasWarningHud.getContext('2d');

var canvasBoss = document.getElementById('canvasBoss');
var ctxBoss = canvasBoss.getContext('2d');

var canvasBullets = document.getElementById('canvasBullets');
var ctxBullets = canvasBullets.getContext('2d');

var canvasRadiation = document.getElementById('canvasRadiation');
var ctxRadiation = canvasRadiation.getContext('2d');

//main variables
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var warningHudText = '';
var multiplier = 'x1';
var bullets = [];
var totalBullets = 0;
var spawnedBullets = 0;
var spawnRate = 35;
var spawnAmount = 1;
var score = 0;

//setInterval && setTimeout
var spawnInterval;
var phaseInterval;
var phaseOneHudTimeout;
var phaseOneActionTimeout;

//objects
var hud1 = new Hud();
var multiplier1 = new Multiplier();
var warninghud1 = new WarningHud();
var shooter1 = new Shooter();
var boss1 = new Boss();
var radiation = new Radiation();

//colors vars
var phaseOneTriStartColor = '#ffcc11';
var phaseOneTriEndColor = '#f12f12';
var phaseTwoTriStartColor = '#f12f12';
var phaseTwoTriEndColor = '#303030';

var isPlaying = false;
var gameIsOver = false;
var scoreCheck = false;

var requestAnimFrame =  window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.msRequestAnimationFrame ||
window.oRequestAnimationFrame;		

//init 
function init() {
	startLoop();
	pulseInit();
	startSpawningBullets();
document.addEventListener('keydown',checkKeyDown,false);
document.addEventListener('keyup',checkKeyUp,false);
}

function pulseInit(){
	animateColor(ctxBoss.fillstyle, phaseOneTriStartColor, phaseOneTriEndColor);
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
	if (phase===0){}
	else if (phase===1) {
		phaseOneHudTimeout=setTimeout(function() {
			warningHudText = "TRIANGLE GOES IMBA!!!!"
			phaseOneActionTimeout=setTimeout(function() {
				phase = 2; 
				warningHudText = ''; 
				clearTimeout(animateTimer); 
				colorIntervalPhaseTwo();}, 4000);
		}, 3000)

	} else if (phase === 2){
		phase = 1;
		clearTimeout(animateTimer); 
		colorIntervalPhaseOne();
	}
}

function stopPhaseOneHudTimeout(){
	clearTimeout(phaseOneHudTimeout);
}

function stopPhaseOneActionTimeout(){
	clearTimeout(phaseOneActionTimeout);
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
		multiplier1.draw();
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

//color pulse
function colorIntervalPhaseOne() {
	animateColor(ctxBoss.fillstyle, phaseOneTriStartColor, phaseOneTriEndColor);
}
function colorIntervalPhaseTwo() {
	animateColor(ctxBoss.fillstyle, phaseTwoTriStartColor, phaseTwoTriEndColor);
}

function d2h(dec) { 
	return dec.toString(16);
}
function h2d(hex) { 
	return parseInt(hex,16);
}
function rgb2h(r,g,b) { 
	return [d2h(r),d2h(g),d2h(b)];
}
function h2rgb(h,e,x) {
	return [h2d(h),h2d(e),h2d(x)];
}
function cssColor2rgb(color) {
	if(color.indexOf('rgb')<=-1) {
		return h2rgb(color.substring(1,3),color.substring(3,5),color.substring(5,7));
	}
	return color.substring(4,color.length-1).split(',');
}

var newColor;
var isNewColor=false;
function animateColor(colorVar,begin,end, duration, fps) {
	if(!duration) duration = 1000;
	if(!fps) fps = 20;
	duration=parseFloat(duration);
	fps=parseFloat(fps);
var interval    = Math.ceil(1000/fps);  //50
var totalframes = Math.ceil(duration/interval);  //40

for(i=1;i <= totalframes;i++) {
	(function() {
		var frame=i;
		var b = cssColor2rgb(begin);
		var e  = cssColor2rgb(end);
		var change0=e[0]-b[0];
		var change1=e[1]-b[1];
		var change2=e[2]-b[2];

		var change3=b[0]-e[0];
		var change4=b[1]-e[1];
		var change5=b[2]-e[2];

		function color() {
			if (!isNewColor) {
				var increase0=ease(frame, b[0], change0, totalframes/2);
				var increase1=ease(frame, b[1], change1, totalframes/2);
				var increase2=ease(frame, b[2], change2, totalframes/2);
				newColor = ('#'+d2h(parseInt(increase0))+d2h(parseInt(increase1))+d2h(parseInt(increase2)));
				if (newColor === end) isNewColor=true;
			} 

			if (isNewColor) {
				var increase3=ease(frame-totalframes/2, e[0], change3, totalframes/2);
				var increase4=ease(frame-totalframes/2, e[1], change4, totalframes/2);
				var increase5=ease(frame-totalframes/2, e[2], change5, totalframes/2);
				newColor = ('#'+d2h(parseInt(increase3))+d2h(parseInt(increase4))+d2h(parseInt(increase5)));
				if (newColor === begin) isNewColor=false;
			}

			ctxBoss.fillStyle = newColor;     
		}
		timer = setTimeout(color,interval*frame);
	})(); 
}

animateTimer=setTimeout(function() {animateColor(ctxBoss.fillstyle,begin,end,duration,fps);},1000);
}
function ease(frame,begin,change,totalframes) {
	return begin+change*(frame/totalframes);

}


//update score 
function checkScore(){
	if (scoreCheck){

		if ((shooter1.drawX>=gameWidth/2-(0.5)*boss1.width) && (shooter1.drawX<=gameWidth/2+(0.5)*boss1.width)){
			if (shooter1.drawY<=gameHeight/2*.4) { score = score + 15; multiplier='x8' } 
			else if	(shooter1.drawY<=gameHeight/2*.6) { score = score + 15; multiplier='x4' } 
			else if (shooter1.drawY<=gameHeight/2) { score = score + 2;  multiplier='x2' }
			else { score ++; multiplier='x1'};
		}
	}
}


//hud
function Hud() {}
Hud.prototype.draw = function() {
	clearCtxHud();
	ctxHud.fillStyle = 'white';
	ctxHud.font = '12px Gruppo'
	ctxHud.fillText(score, 10, 25);
}
function clearCtxHud() {
	ctxHud.clearRect(0,0,gameWidth,gameHeight);
}

//warning hud
function WarningHud() {

}
WarningHud.prototype.draw = function() {
	clearCtxWarningHud();
	ctxWarningHud.fillText(warningHudText, gameWidth/2 - 120, 120);
	ctxWarningHud.fillStyle = 'red';
	ctxWarningHud.font = '22px Gruppo';
}
function clearCtxWarningHud() {
	ctxWarningHud.clearRect(0,0,gameWidth,gameHeight);
}

//multiplier
function Multiplier() {}

Multiplier.prototype.draw = function() {
	clearCtxMultiplier();
	ctxMultiplier.fillText(multiplier, 13, 40);
	ctxMultiplier.fillStyle = 'red';
	ctxMultiplier.font = '12px Gruppo';
}
function clearCtxMultiplier() {
	ctxMultiplier.clearRect(0,0,gameWidth,gameHeight);
}

//shooter
function Shooter() {
	this.radius = 2;
	this.drawX = gameWidth/2;
	this.drawY = 480;
	this.speed = 3;
	this.isLeftKey = false;
	this.isRightKey = false;
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
	this.width = 246;
	this.height = 62;
}
var imageObj = new Image();
imageObj.src='radiation.png';
Radiation.prototype.draw = function() {
	clearCtxRadiation();
	ctxRadiation.drawImage(imageObj, shooter1.drawX-.5*this.width+6, 0, this.width, this.height);
}
function clearCtxRadiation() {
	ctxRadiation.clearRect(0,0,gameWidth,gameHeight);
}

//boss
function Boss() {
	this.drawX = gameWidth/2;
	this.drawY = 0;
	this.width = 100;
	this.height = 50;
	this.speed = 2;
	this.isLeftKey = false;
	this.isRightKey = false;
}

Boss.prototype.draw = function() {
	clearCtxBoss();
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
	if (angle>80){
		angleDirection = 'right';
	}
	if (angle<-80) angleDirection = 'left';

	if (angleDirection==='left') angle=angle+0.1;
	if (angleDirection==='right') angle=angle-0.1;

	this.drawY = this.drawY + Math.cos(this.radians) * this.speed;
	this.drawX = this.drawX + Math.sin(this.radians) * this.speed;

	ctxBullets.fillStyle='#fff';
	ctxBullets.beginPath();
	ctxBullets.arc(this.drawX, this.drawY, this.bulletRadius, 0, 2 * Math.PI, false);

	if (phase === 2) { 
		this.bulletRadius = this.bulletRadius + 0.4; 
		ctxBullets.fillStyle='#f11';
	}
	ctxBullets.fill();
	this.checkEscaped();

//check for collision
if (this.drawX <= shooter1.drawX + this.bulletRadius + 2 &&
	this.drawX >= shooter1.drawX - this.bulletRadius - 2 &&
	this.drawY <= shooter1.drawY + this.bulletRadius + 2 &&
	this.drawY >= shooter1.drawY - this.bulletRadius - 2 || 
	(

		((shooter1.drawX>=gameWidth/2-shooter1.radius/2-(0.5)*boss1.width) && 
		(shooter1.drawX<=gameWidth/2+shooter1.radius/2+(0.5)*boss1.width)) &&
		(shooter1.drawY>=0) && 
		(shooter1.drawY<=boss1.height+shooter1.radius/2) 

		)
	)
{
	gameOver();

} 

}

//game over function
function gameOver() {
	if(!gameIsOver){
	gameIsOver=true;
	multiplier='x0';
	stopSpawningBullets();
	stopPhaseInterval();
	stopPhaseOneHudTimeout();
	stopPhaseOneActionTimeout();
	clearTimeout(animateTimer); 
	scoreCheck=false;
	warningHudText='GAME OVER! Score: ' + score;
	setTimeout(function() {
		startSpawningBullets();
		pulseInit();
		gameIsOver=false;
	}, 10000);
	}
}

Bullets.prototype.checkEscaped = function() {
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