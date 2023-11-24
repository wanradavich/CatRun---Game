"use strict";
// window.onload = function() {
//     // Sets a fixed window size
//     let width = 768;
//     let height = 616;
//     window.resizeTo(width, height);
//     window.focus();
// }

const currentDate= new Date();
const timeDate = document.getElementById('time-date');
const dateDate = document.getElementById('date-date');
timeDate.innerHTML = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
dateDate.innerHTML = `${currentDate.getFullYear()} ${currentDate.getMonth()} ${currentDate.getDate()}`;

let timerInterval;
let seconds = 0;
let minutes = 0;

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const gameControls = {
    title: "Cat Run",
    isRunning: false,
    wasRunning: false, 
    currentScreen: 'start-screen',
    currentModal: null,
    playBtn: document.getElementById('playBtn'),
    inputName: document.getElementById('inputName'),

    showModal: function(){
        if (this.currentScreen === 'game-screen'){
            this.currentModal = new bootstrap.Modal($('#infoModal'));
            this.currentModal.show();
            this.wasRunning = this.isRunning;
            this.isRunning = false;
        }
    },
    closeModal: function(){
        this.currentModal.hide();
        this.currentModal = null;

        if (this.currentScreen === 'game-screen'){
            this.isRunning = this.wasRunning;
        }
    },
    toggleRunning: function(){
        this.isRunning = !this.isRunning;
    },
    switchScreen: function(screenName){
        this.currentScreen=screenName;
        $('.screen').each(function() {
            $(this).addClass('hide');
        });
        
        $('#' + screenName).removeClass('hide');

        if (screenName === 'start-screen'){
            $('#homeBtn').addClass('hide');           
            $('#quitBtn').addClass('hide');
            $('#infoBtn').addClass('hide');
            $('#playBtn').addClass('hide');
            $('#helpBtn').removeClass('hide');
        } else if (screenName === 'game-screen'){
            $('#homeBtn').addClass('hide');
            $('#quitBtn').removeClass('hide');
            $('#helpBtn').addClass('hide'); 
            $('#infoBtn').removeClass('hide');
            $('#playBtn').removeClass('hide');       
        } else if (screenName === 'gameover-screen'){
            $('#helpBtn').removeClass('hide');
            $('#quitBtn').addClass('hide');
            $('#homeBtn').removeClass('hide');
            $('#infoBtn').addClass('hide');
            $('#playBtn').addClass('hide');
        } else if (screenName === 'instruction-screen'){
            $('#homeBtn').removeClass('hide');
            $('#helpBtn').addClass('hide');
            $('#quitBtn').addClass('hide');
            $('#playBtn').addClass('hide');
        }
    },
    init: function(){
        this.switchScreen(this.currentScreen);
        $('#runBtn').on('click', () => {

            this.switchScreen('game-screen');
        });

        $('#playPauseBtn').on('click', () => {
            this.toggleRunning();
            if(this.isRunning){
                $('#playPauseBtn').html('Pause');
            } else {
                $('#playPauseBtn').html('Play');
        }});

        $('#quitBtn').on('click', () => {
            resetGame();
            this.switchScreen('start-screen');
        });

        $('#helpBtn').on('click', () => {
            this.switchScreen('instruction-screen');
        })

        $('#infoBtn').on('click', () => {
            this.showModal()
        })

        $('#homeBtn').on('click', () => {
            this.switchScreen('start-screen');
        })

        $('#tryAgainBtn').on('click', () => {
            this.switchScreen('game-screen');
        })

        $('#runBtn').prop('disabled', true);

        $('#runBtn').on('click', () => {
            const userInput = $('#inputName').val().trim();
            if (userInput !== ''){
                $('#inputName').val('');
                $('#inputName').attr('placeholder', '[enter cat name]');
                gameControls.switchScreen('game-screen');
            }
            
        })

        $('#calico').on('click', () => {
            catImg.src = './images/calico-profile.png';
            $('#cat-img').attr('src', './images/calico-cat.png');
        });
    
        $('#brown').on('click', () => {
            catImg.src = './images/brown-profile.png';
            $('#cat-img').attr('src', './images/brown-cat.png');
        });
    
        $('#cream').on('click', () => {
            catImg.src = './images/cream-profile.png';
            $('#cat-img').attr('src', './images/cream-cat.png');
        });

        $('#inputName').on('input', function() {
            const enteredName = $(this).val().trim();
            $('#cat-name').text(enteredName);
            if(enteredName !== ''){
                $('#runBtn').prop('disabled', false);
            } else {
                $('#runBtn').prop('disabled', true);
            }
        });
      
    }
}

class CatAnimation {
    constructor() {
        this.catCanvas = document.getElementById('cat-canvas');
        this.catCtx = this.catCanvas.getContext('2d');
        this.catCanvas.width = 300;
        this.catCanvas.height = 300;

        this.cat = new Cat(this.catCanvas.width, this.catCanvas.height);

        this.animationFrame = null;
    }

    animate = () => {
        if (gameControls.isRunning){
            this.catCtx.clearRect(0, 0, this.catCanvas.width, this.catCanvas.height);
            this.cat.draw(this.catCtx);
            this.cat.update();
            this.animationFrame = requestAnimationFrame(this.animate);
        }
    };

    startAnimation = () => {
        if (!this.animationFrame) {
            this.animate();
        }
    };

    stopAnimation = () => {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
    };
}

class CatPart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

//Cat in Cat Canvas
class Cat {
    constructor(canvasWidth, canvasHeight, frameRate=5){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = document.getElementById('cat-img');
        this.spriteWidth = 31.4;
        this.spriteHeight = 26;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.scale = 5;
        this.x = this.canvasWidth / 2 - this.width * this.scale / 2;
        this.y = this.canvasHeight / 2 - this.height * this.scale/ 2;
        this.minFrame = 0;
        this.maxFrame = 8;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frameRate = frameRate; 
        this.frameCount = 0;
        this.framesPerUpdate = Math.round(60 / this.frameRate); // Calculate frames per update based on frame rate
    }

    draw(context){
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width * this.scale, this.height * this.scale);
    }

    update() {
        this.frameCount++; 
        if (this.frameCount >= this.framesPerUpdate) {
            if (this.frameX < 7) this.frameX++;
            else this.frameX = 0;
            this.frameCount = 0; 
        }
    }  
}



//home page 
helpBtn.addEventListener(('click'), () => {
    instructionScreen.classList.remove('hide');
    startScreen.classList.add('hide');
    gameScreen.classList.add('hide');
    gameOverScreen.classList.add('hide');
})

//GAME VARIABLES
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

let speed = 4;

let tileCount = 25;
let tileSize = canvas.width/tileCount;
let headX = 10;
let headY = 10;
const catParts = [];
let tailLength = 0;

//Fish X/Y
let fishGoodX = 5;
let fishGoodY = 5

let fishMagicalX = 6;
let fishMagicalY = 6;

let fishBadX = 7;
let fishBadY = 7;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let randomScore = Math.floor(Math.random() * 6);
let gameInterval;

//MAIN GAME LOOP
function drawGame(){ 
    if (gameControls.isRunning){
        gameInterval = setTimeout(drawGame, 1000 / speed);
        changeCatPosition();
    let result = isGameOver();
    if(result){
        displayGameOver();
    }
    clearScreen(); 
    displayScore(); 
    drawGoodFish();
    drawMagicalFish();
    drawBadFish();
    checkGoodFishCollion();
    checkMagicalFishCollision();
    checkBadFishCollision();
    drawCat(); 
    }
}

function isGameOver(){
    let gameOver = false;
    if (xVelocity === 0 && yVelocity === 0){
        gameOver = false;
    }
    if (headX < 0){ 
        gameOver = true;
    }
    if (headX === tileCount){ 
        gameOver = true;
    }
    if (headY < 0){ 
        gameOver = true;
    }
    if (headY === tileCount){ 
        gameOver = true;
    }

    for (let i = 0; i < catParts.length; i++){
        let part = catParts[i];
        if (part.x === headX && part.y == headY){
            gameOver = true;
            break;
        }
    }

    return gameOver;
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//CAT AND FISH CANVAS CHARACTERS
const catImg = new Image();
catImg.src = '../images/brown-profile.png'

const goodFishImg = new Image();
goodFishImg.src = '../images/good-fish.png';

const magicalFishImg = new Image();
magicalFishImg.src = '../images/magical-fish.png';

const badFishImg = new Image();
badFishImg.src = '../images/bad-fish.png';

function drawCat(){
    for (let i = 0; i < catParts.length; i++){
        let part = catParts[i];
        let centerX = part.x * tileSize + tileSize * 1.5;
        let centerY = part.y * tileSize + tileSize * 1.5;
        ctx.fillStyle = "yellowgreen";
        ctx.fillRect(centerX - tileSize, centerY - tileSize, tileSize * .5, tileSize * .5);
    };
        
    catParts.push(new CatPart(headX, headY));
    while (catParts.length > tailLength){
        catParts.shift();
    }
    
    ctx.drawImage(
        catImg,
        headX * tileSize,
        headY * tileSize,
        tileSize * 1.5,
        tileSize * 1.5
    )
}

function changeCatPosition(){
    if (gameControls.isRunning){
        headX = headX + xVelocity;
        headY = headY + yVelocity;
    }   
}

const FishType = {
    GOOD: 'good',
    MAGICAL: 'magical',
    BAD: 'bad',
  };
  
let currentFishType = FishType.GOOD;

//Good Fish
function drawGoodFish(){
    ctx.drawImage(
        goodFishImg,
        fishGoodX * tileCount,
        fishGoodY * tileCount,
        tileSize,
        tileSize
    )
}

function checkGoodFishCollion() {
    if (fishGoodX === headX && fishGoodY === headY) {
      handleFishCollision(FishType.GOOD);
      fishGoodX = Math.floor(Math.random() * tileCount);
      fishGoodY = Math.floor(Math.random() * tileCount);
      tailLength++;
    }
  }

//Magical Fish
function drawMagicalFish(){
    ctx.drawImage(
        magicalFishImg,
        fishMagicalX * tileCount,
        fishMagicalY * tileCount,
        tileSize,
        tileSize
    )
}

function placeMagicalFish(){
    fishMagicalX = Math.floor(Math.random() * tileCount);
    fishMagicalY = Math.floor(Math.random() * tileCount);
}

function checkMagicalFishCollision() {
    if (fishMagicalX === headX && fishMagicalY === headY) {
      handleFishCollision(FishType.MAGICAL);
      placeMagicalFish();
    }
  }

//Bad Fish
function drawBadFish(){
    ctx.drawImage(
        badFishImg,
        fishBadX * tileCount,
        fishBadY * tileCount,
        tileSize,
        tileSize
    )
}
function placeBadFish(){
    fishBadX = Math.floor(Math.random() * tileCount);
    fishBadY = Math.floor(Math.random() * tileCount);
}

function checkBadFishCollision() {
    if (fishBadX === headX && fishBadY === headY) {
      handleFishCollision(FishType.BAD);
      placeBadFish();
    }
  }

function handleFishCollision(fishType) {
    switch (fishType) {
      case FishType.GOOD:
        score++;
        break;
      case FishType.MAGICAL:
        score += randomScore;
        break;
      case FishType.BAD:
        tailLength += randomScore;
        score -= randomScore;
        break;
      default:
        break;
    }
  }

function displayScore(){
    document.getElementById('score').textContent = `${score}`;  
}

function displayGameOver(){
    document.getElementById('instruction-screen').classList.add('hide');
    document.getElementById('start-screen').classList.add('hide');
    document.getElementById('game-screen').classList.add('hide');
    document.getElementById('gameover-screen').classList.remove('hide');
    document.getElementById('gameover-score').textContent = `Score: ${score}`; 
}

function resetGame() {
    // Reset game variables
    score = 0;
    headX = 10;
    headY = 10;
    tailLength = 0;

    // Reset fish positions
    fishGoodX = 5;
    fishGoodY = 5;
    fishMagicalX = 6;
    fishMagicalY = 6;
    fishBadX = 7;
    fishBadY = 7;

    // Reset velocities
    xVelocity = 0;
    yVelocity = 0;

    // Clear intervals and timeouts
    clearInterval(badInterval);
    clearInterval(magicalInterval);
    clearTimeout(gameInterval);
    
    $('#gameover-screen').addClass('hide');
    $('#start-screen').addClass('hide');
    $('#instruction-screen').addClass('hide');
    $('#game-screen').removeClass('hide');

    drawGame();
}



//KEY DIRECTIONS CONTROLS
let isSpaceBar = false;

function keyDirection(event){
    if (!gameControls.isRunning) return;
    //up
    if (event.keyCode == 38){
        if (yVelocity == 1) return;
        yVelocity = -1;
        xVelocity = 0;
    }
    //down
    if  (event.keyCode == 40){
        if (yVelocity == -1) return;
        yVelocity = 1;
        xVelocity = 0;
    }
    //left
    if (event.keyCode == 37){
        if (xVelocity == 1) return;
        yVelocity = 0;
        xVelocity = -1;
    }
    //right
    if (event.keyCode == 39){
        if (xVelocity == -1) return; 
        yVelocity = 0;
        xVelocity = 1;
    }

    //spacebar play/pause
    if (event.keyCode == 32 && !isSpaceBar){
        isSpaceBar = true;
        if (gameControls.isRunning){
            pressPlay();
        } else {
            pressPause();
        }  
    } else if (event.keyCode !== 32){
        isSpaceBar = false;
    }
}
let badInterval;
let magicalInterval;
function pressPlay(){
    playBtn.innerHTML = "Pause";
    playBtn.classList.remove("play");
    playBtn.classList.add("pause");
    border.classList.remove("c-pause");
    border.classList.add("c-play");
    newCatAnimation.startAnimation();
    if (!gameInterval){
        drawGame(); 
    }

    if (!badInterval) {
        badInterval = setInterval(placeBadFish, 5000);
    }
    if (!magicalInterval) {
        magicalInterval = setInterval(placeMagicalFish, 2000);
    }
    startTimer();
}

function pressPause(){
    playBtn.innerHTML = "Play";
    playBtn.classList.remove("pause");
    playBtn.classList.add("play"); 
    border.classList.remove("c-play");
    border.classList.add("c-pause");
    newCatAnimation.stopAnimation();
    clearInterval(badInterval);
    clearInterval(magicalInterval);
    badInterval = null;
    magicalInterval = null;
    clearTimeout(gameInterval);
    gameInterval = null;
    stopTimer();
}

document.addEventListener('DOMContentLoaded', function() {
    const catProfiles = document.querySelectorAll('.cat-profile');

    catProfiles.forEach(cat => {
        cat.addEventListener('click', function() {
            catProfiles.forEach(cat => {
                if (cat !== this){
                    cat.classList.remove('clicked');
                }
            })
            this.classList.toggle('clicked');
        });
    });
});
document.body.addEventListener('keydown', keyDirection); 
const newCatAnimation = new CatAnimation();
const border = document.getElementById("cat-canvas");

gameControls.init();
gameControls.playBtn.addEventListener('click', function(){
   
    gameControls.toggleRunning();  
    if(gameControls.isRunning){ 
        pressPlay();
    } else {
        pressPause();
    }
});