"use strict";

const gameControls = {
    title: "Cat Run",
    isRunning: false,
    wasRunning: false, 
    currentScreen: 'start-screen',
    currentModal: null,
    playBtn: document.getElementById('playBtn'),
    inputName: document.getElementById('inputName'),
    soundIsPlaying: false,

    toggleSound: function(){
        this.soundIsPlaying = !this.soundIsPlaying;
    },
    checkCatChosen: function() {
        const chosenCat = document.querySelector('.cat-profile.clicked');
        if (chosenCat) {
            $('#runBtn').prop('disabled', false);
        } else {
            $('#runBtn').prop('disabled', true);
            btnSound.pause();
        }
    },
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
            $('#restartBtn').addClass('hide')
        } else if (screenName === 'game-screen'){
            $('#homeBtn').addClass('hide');
            $('#quitBtn').removeClass('hide');
            $('#helpBtn').addClass('hide'); 
            $('#infoBtn').removeClass('hide');
            $('#playBtn').removeClass('hide');  
            $('#soundBtn').removeClass('hide'); 
            $('#restartBtn').addClass('hide'); 
            
            pressPlay();
            pressPause();
        } else if (screenName === 'gameover-screen'){
            //clear timer
            stopTimer();
            $('#helpBtn').removeClass('hide');
            $('#quitBtn').addClass('hide');
            $('#homeBtn').addClass('hide');
            $('#infoBtn').addClass('hide');
            $('#playBtn').addClass('hide');
            $('#soundBtn').addClass('hide'); 
            $('#restartBtn').removeClass('hide');
        } else if (screenName === 'instruction-screen'){
            $('#homeBtn').removeClass('hide');
            $('#helpBtn').addClass('hide');
            $('#quitBtn').addClass('hide');
            $('#playBtn').addClass('hide');
            $('#restartBtn').addClass('hide');
        }
    },
    init: function(){
        gameControls.isRunning = false;
        this.switchScreen(this.currentScreen);
        $('#soundBtn').on('click', () => {
            this.toggleSound();
            if (this.soundIsPlaying){
                playBackgroundSound();
                $('#soundBtn').html(`
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16">
                <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                </svg>`);
            } else if (!this.soundIsPlaying){
                pauseBackgroundSound()
                $('#soundBtn').html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-music-note-beamed" viewBox="0 0 16 16">
                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
              </svg>`);
            }
        });

        $('#playPauseBtn').on('click', () => {
            this.toggleRunning();
            if(this.isRunning){
                playBtnSound();
                $('#playPauseBtn').html('Pause');
            } else {
                playBtnSound();
                $('#playPauseBtn').html('Play');
        }});

        $('#quitBtn').on('click', () => {
            playBtnSound();
            resetGame();
            resetTimer();
            this.switchScreen('start-screen');
        });

        $('#helpBtn').on('click', () => {
            playBtnSound();
            this.switchScreen('instruction-screen');
        });

        $('#infoBtn').on('click', () => {
            playBtnSound();
            this.showModal()
        });

        $('#homeBtn').on('click', () => {
            playBtnSound();
            this.switchScreen('start-screen');
        });

        $('#restartBtn').on('click', () => {
            this.switchScreen('start-screen');
        });

        $('#runBtn').prop('disabled', true);

        $('#runBtn').on('click', () => {
            playStartSound();
            const userInput = $('#inputName').val().trim();
            if (userInput !== ''){
                $('#inputName').val('');
                $('#inputName').attr('placeholder', '[enter cat name]');
                gameControls.switchScreen('game-screen');
            }
            pauseBackgroundSound();
        });

        $('#tryAgainBtn').on('click', () => {
            playStartSound();
            this.switchScreen('game-screen');
            resetTimer();
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

//body of cat when eating fish
class CatPart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

//running cat canvas for profile
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

//CAT player in Cat Canvas
class Cat {
    constructor(canvasWidth, canvasHeight, frameRate=3){
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
let randomScore = Math.floor(Math.random() * 6) + 1;
let gameInterval;

//check if it's working//
if (score == 3){
    speed ++;
} else if (score == 6){
    speed++;
} else if (score == 9){
    speed++;
} else if (score == 12){
    speed++;
} else if (score == 15){
    speed++;
}

//score in gameover
function displayScore(){
    let prevScore = score;
    $('#go-score').html(prevScore);
}

//score in gameboard
function currentScore() {
    $('#score').html(score);
}

//MAIN GAME LOOP
function drawGame(){ 
    if (gameControls.isRunning){
        gameInterval = setTimeout(drawGame, 1000 / speed);
        changeCatPosition();
    
    let result = isGameOver();
    if(result){
        displayScore()
        resetGame();
        stopTimer();
        gameControls.switchScreen('gameover-screen');
        playGoSound();
    }
    clearScreen(); 
    currentScore();
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
        if (part.x === fishBadX && part.y == fishBadY){

            gameOver = true;
            break;
        }
        // if ((part.x === fishGoodX && part.y === fishGoodY) || (part.x === fishMagicalX && part.y === fishMagicalY) || (part.x === fishBadX && part.y === fishBadY))
        // gameOver = true;
        // break;// do a check if it works in the game
    }

    if (score < 0){
        gameOver = true;
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
        playEatSound();
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
        playEatSound();
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
        playBFSound()
        handleFishCollision(FishType.BAD);
        placeBadFish();
    }
    if (score < 0){   
        gameOver = true;
        if(isGameOver){
            gameControls.switchScreen('gameover-screen')
        }
        resetGame();
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
    
    //reset timer
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

//AUDIO AND DATE FUNCTIONS
//background audio
const backgroundSound = new Audio('../audio/game-bg.mp3');
function playBackgroundSound() {
    backgroundSound.loop = true;
    backgroundSound.play().then(() => {
        console.log('BG Sound is playing...')
    }).catch(error => {
        console.error('Error playing sound:', error);
    });
}

function pauseBackgroundSound(){
    backgroundSound.pause();
}

//buttons audio 
const btnSound = new Audio('../audio/game-buttons.mp3');
function playBtnSound(){
    console.log('Trying to play button sound...');
    if(!btnSound.paused){
        btnSound.currentTime = 0; // Resetting the audio to the beginning
    }
    btnSound.play().then(() => {
        console.log('Button sound playing!');
    }).catch(error => {
        console.error('Error playing sound', error);
    });
}

//start audio
const startSound = new Audio('../audio/game-decide.mp3');
function playStartSound(){
    if(!startSound.paused){
        startSound.currentTime = 0;
    }
    startSound.play().then(() => {
        console.log('[sound of game starting...]');
    }).catch(error => {
        console.error('Error eat sound', error);
    });
}

//eat audio
const eatSound = new Audio('../audio/game-eat.mp3');
function playEatSound(){
    if(!eatSound.paused){
        btnSound.currentTime = 0;
    }
    eatSound.play().then(() => {
        console.log('[sound of cat eating...]');
    }).catch(error => {
        console.error('Error eat sound', error);
    })
}

//eat bad fish audio
const badFishSound = new Audio('../audio/game-badfish.mp3');
function playBFSound(){
    if(!badFishSound.paused){
        badFishSound.currentTime = 0;
    }
    badFishSound.play().then(() => {
        console.log('[cat ate bad fish...]');
    }).catch(error => {
        console.error('Error bad fish eat sound', error);
    });
}

const goSound = new Audio('../audio/game-end.mp3');
function playGoSound(){
    goSound.play();
}

// date bar
const currentDate= new Date();
const timeDate = document.getElementById('time-date');
const dateDate = document.getElementById('date-date');
timeDate.innerHTML = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
dateDate.innerHTML = `${currentDate.getFullYear()} ${currentDate.getMonth() + 1} ${currentDate.getDate()}`;

let timerInterval;
let seconds = 0;
let minutes = 0;
let finalTime = '';

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
    finalTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateGameoverScreen();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    const scoreTimerDisplay = document.getElementById('time-score');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    scoreTimerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    clearInterval(timerInterval);
    minutes = 0;
    seconds = 0;
    updateTimerDisplay();
}

function updateGameoverScreen() {
    //display the final time with id 
    const timeScore = document.getElementById('time-score');
    timeScore.textContent = `${finalTime}`;
}

//DOCUMENT EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    const catProfiles = document.querySelectorAll('.cat-profile');

    catProfiles.forEach(cat => {
        cat.addEventListener('mouseenter', function(){
            playBtnSound();
        });
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

document.addEventListener('DOMContentLoaded', function() {
    const catProfiles = document.querySelectorAll('.cat-profile');

    catProfiles.forEach(cat => {
        cat.addEventListener('click', function() {
            // If already clicked, return without toggling
            if (this.classList.contains('clicked')) {
                return;
            }

            // Remove 'clicked' class from other cats
            catProfiles.forEach(cat => {
                if (cat !== this) {
                    cat.classList.remove('clicked');
                }
            });

            // Toggle 'clicked' class for the current cat
            this.classList.add('clicked');
        });
    });
});

document.body.addEventListener('keydown', keyDirection); 
const newCatAnimation = new CatAnimation();
const border = document.getElementById("cat-canvas");
let badInterval;
let magicalInterval;



function pressPlay(){
    gameControls.isRunning = true;
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
        magicalInterval = setInterval(placeMagicalFish, 4000);
    }
    startTimer();
}

function pressPause(){
    gameControls.isRunning = false;
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

//GAME INIT
gameControls.init();
gameControls.playBtn.addEventListener('click', function(){
    gameControls.toggleRunning();  
    if(gameControls.isRunning){ 
        pressPlay();
    } else {
        pressPause();
    }
});