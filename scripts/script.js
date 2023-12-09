"use strict";

//game controls object literal 
const gameControls = {
    title: "Cat Run", 
    isRunning: false, //flag if game is running
    wasRunning: false, //flag to store previous game state
    currentScreen: 'start-screen', //used with the switch screen function
    currentModal: null, //track displayed modal
    playBtn: document.getElementById('playBtn'), 
    inputName: document.getElementById('inputName'),
    soundIsPlaying: false, //flag if game sound is playing

    //method to toggle game music
    toggleSound: function(){
        this.soundIsPlaying = !this.soundIsPlaying;
    },
    //method to check if cat profile is chosen before enabling run/start button
    checkCatChosen: function() {
        //check if cat is chosen or has .clicked
        const chosenCat = document.querySelector('.cat-profile.clicked');
        if (chosenCat) {
            //if yes enable button 
            $('#runBtn').prop('disabled', false);
        } else {
            //if not disable button 
            $('#runBtn').prop('disabled', true);
            btnSound.pause();
        }
    },
    //method to display modal and pause the game if in game screen
    showModal: function(){
        if (this.currentScreen === 'game-screen'){
            this.currentModal = new bootstrap.Modal($('#infoModal'));
            this.currentModal.show();
            this.wasRunning = this.isRunning;
            this.isRunning = false;
        }
    },
    //method to close modal and resume game if previously active
    closeModal: function(){
        this.currentModal.hide();
        this.currentModal = null;

        if (this.currentScreen === 'game-screen'){
            this.isRunning = this.wasRunning;
        }
    },
    //method to toggle game running state (start/pause)
    toggleRunning: function(){
        this.isRunning = !this.isRunning;
    },
    //method to switch between different game screens 
    switchScreen: function(screenName){
        this.currentScreen=screenName;
        $('.screen').each(function() {
            $(this).addClass('hide');
        });
        
        $('#' + screenName).removeClass('hide');

         //hide and show buttons of each specific screens
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
            //press play button functions for the game screen
            pressPlay();
            pressPause();
        } else if (screenName === 'gameover-screen'){
            //clears timer too
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
        //initialize logic for game control and event listeners
        gameControls.isRunning = false;
        this.switchScreen(this.currentScreen);
        //event listener to toggle game sound on/off
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
        //event listener for playing/pausing game 
        $('#playPauseBtn').on('click', () => {
            //toggle game running state and update button text
            this.toggleRunning();
            if(this.isRunning){
                playBtnSound();
                $('#playPauseBtn').html('Pause');
            } else {
                playBtnSound();
                $('#playPauseBtn').html('Play');
        }});

        //event listener for quitting game
        $('#quitBtn').on('click', () => {
            //reset game and switch to start screen
            playBtnSound();
            resetGame();
            this.switchScreen('start-screen');
        });

        //event listener for displaying instructions
        $('#helpBtn').on('click', () => {
            playBtnSound();
            this.switchScreen('instruction-screen'); //switch to instruction screen
        });

        //event listener for displaying info modals in the game screen
        $('#infoBtn').on('click', () => {
            playBtnSound();
            this.showModal()
        });

        //event listener for returning to start screen
        $('#homeBtn').on('click', () => {
            playBtnSound();
            this.switchScreen('start-screen');
        });

        //event listener for restarting game from start screen
        $('#restartBtn').on('click', () => {
            this.switchScreen('start-screen');
        });

        //event listener for starting the game if user input is provided and reset game timer
        $('#runBtn').prop('disabled', true);

        $('#runBtn').on('click', () => {
            playStartSound();
            const userInput = $('#inputName').val().trim();
            if (userInput !== ''){
                $('#inputName').val('');
                $('#inputName').attr('placeholder', '[enter cat name]');
                gameControls.switchScreen('game-screen');
                resetTimer(); //timer reset
            }
        });

        //event listener for trying the game again after game over
        $('#tryAgainBtn').on('click', () => {
            playStartSound();
            this.switchScreen('game-screen'); // goes back to game screen 
            resetTimer(); //reset timer
        })

        //event listeners for selecting different cat profiles
        $('#calico').on('click', () => { //calico cat profile
            catImg.src = './images/calico-profile.png';
            $('#cat-img').attr('src', './images/calico-cat.png');
        });
    
        $('#brown').on('click', () => { //brown cat profile
            catImg.src = './images/brown-profile.png';
            $('#cat-img').attr('src', './images/brown-cat.png');
        });
    
        $('#cream').on('click', () => { //cream cat profile
            catImg.src = './images/cream-profile.png';
            $('#cat-img').attr('src', './images/cream-cat.png');
        });

        //updating cat name and enabling run/start button
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

//body of cat x and y coordinates
class CatPart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

//running cat canvas for profile
class CatAnimation {
    constructor() {
        //canvas and context for drawing
        this.catCanvas = document.getElementById('cat-canvas'); //canvas element
        this.catCtx = this.catCanvas.getContext('2d'); //canvas context
        //canvas width and height
        this.catCanvas.width = 300;
        this.catCanvas.height = 300;

        //create new Cat object to animate within canvas
        this.cat = new Cat(this.catCanvas.width, this.catCanvas.height);
        //variable sotring animation frame references
        this.animationFrame = null;
    }

    //method to keep animating cat
    animate = () => {
        //check if game is running
        if (gameControls.isRunning){
            //clear canvas before drawing the next frame
            this.catCtx.clearRect(0, 0, this.catCanvas.width, this.catCanvas.height);
            //draw cat on canvas and update animation
            this.cat.draw(this.catCtx);
            this.cat.update();
            //request for next animation frame
            this.animationFrame = requestAnimationFrame(this.animate);
        }
    };

    //method to start animation if it's not already running
    startAnimation = () => {
        if (!this.animationFrame) {
            this.animate(); //animation lop
        }
    };

    //method to stop animation
    stopAnimation = () => {
        //cancel annimation frame
        cancelAnimationFrame(this.animationFrame);
        //reset references
        this.animationFrame = null;
    };
}

//CAT player in Cat Canvas animation
class Cat {
    //initialize cat object
    constructor(canvasWidth, canvasHeight, frameRate=3){
        //properties related to canvas and image
        this.canvasWidth = canvasWidth; //canvas width 
        this.canvasHeight = canvasHeight; //canvas height
        this.image = document.getElementById('cat-img'); //cat image used
        this.spriteWidth = 31.4; //width of sprite frame
        this.spriteHeight = 26; //height of sprite frame

        //cat size and position properties
        this.width = this.spriteWidth; //cat width
        this.height = this.spriteHeight; //cat height
        this.scale = 5; //scale cat
        //x and y postiion of cat
        this.x = this.canvasWidth / 2 - this.width * this.scale / 2;
        this.y = this.canvasHeight / 2 - this.height * this.scale/ 2;

        //animation properties
        this.minFrame = 0;
        this.maxFrame = 8; //max frame
        this.frame = 0;//current frame
        this.frameX = 0; //x position of current frame in sprite sheet
        this.frameY = 0; //y position of current frame in sprite sheet
        this.frameRate = frameRate; //using frame rate that we want
        this.frameCount = 0; //frame track counter
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
//initial cat player speed
let speed = 4;
let tileCount = 25;
let tileSize = canvas.width/tileCount;

//cat head coordinates
let headX = 10;
let headY = 10;

//body part array and cat's tail(body) length
const catParts = [];
let tailLength = 0;

//initial fish X/Y coordinates
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

//speed conditions according to player score
function updateSpeed() {
    if (score > 3 && score <= 6) {
        speed = 5; 
    } else if (score > 6 && score <= 9) {
        speed = 6; 
    } else if (score > 9 && score < 12) {
        speed = 7;
    } else if (score > 12 && score < 15){
        speed = 8;
    } else if (score == 15) {
        speed = 8; 
    }
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

function isGameOver(){
    let gameOver = false;
    //wall collision check
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

    // Check collision with body parts
    for (let i = 1; i < catParts.length; i++){
        let part = catParts[i];
        if (part.x === headX && part.y === headY){
            gameOver = true;
            break;
        }
    }

    // Check collision with fish
    if (!gameOver) {
        for (let i = 0; i < catParts.length; i++){
            let part = catParts[i];
            if ((part.x === fishBadX && part.y === fishBadY) ||
                (part.x === fishMagicalX && part.y === fishMagicalY) ||
                (part.x === fishGoodX && part.y === fishGoodY)){
                gameOver = true;
                break;
            }
        }
    }
   
    //score below 0 check for gameover
    if (score < 0){
        gameOver = true;
    }

    return gameOver;
}

//clears over anything from screen 
function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//CAT AND CANVAS CHARACTERS
//image sources for cat and fish types
const catImg = new Image();
catImg.src = '../images/brown-profile.png'

const goodFishImg = new Image();
goodFishImg.src = '../images/good-fish.png';

const magicalFishImg = new Image();
magicalFishImg.src = '../images/magical-fish.png';

const badFishImg = new Image();
badFishImg.src = '../images/bad-fish.png';


//create each part of cat on game board
function drawCat(){
    for (let i = 0; i < catParts.length; i++){
        let part = catParts[i];
        let centerX = part.x * tileSize + tileSize * 1.5;
        let centerY = part.y * tileSize + tileSize * 1.5;
        ctx.fillStyle = "yellowgreen";
        ctx.fillRect(centerX - tileSize, centerY - tileSize, tileSize * .5, tileSize * .5);
    };
    
    //Add new part at the head position
    catParts.push(new CatPart(headX, headY));
    //remove cat parts to match tailLength check
    while (catParts.length > tailLength){
        catParts.shift();
    }
    
    //draw cat head
    ctx.drawImage(
        catImg,
        headX * tileSize,
        headY * tileSize,
        tileSize * 1.5,
        tileSize * 1.5
    )
}

//change cat position
function changeCatPosition(){
    if (gameControls.isRunning){
        headX = headX + xVelocity;
        headY = headY + yVelocity;
    }   
}

//FISH CANVAS CHARACTERS
// Check if the fish coordinates overlap with the cat or body parts
function isFishOverlap(fishX, fishY) {
    if (fishX === headX && fishY === headY) {
        return true; // Fish overlaps with cat's head
    }
    for (let i = 0; i < catParts.length; i++) {
        let part = catParts[i];
        if (part.x === fishX && part.y === fishY) {
            return true; // Fish overlaps with cat's body
        }
    }
    return false; // Fish doesn't overlap with cat or body parts
}

//create good fish
function drawGoodFish(){
    ctx.drawImage(
        goodFishImg,
        fishGoodX * tileCount,
        fishGoodY * tileCount,
        tileSize,
        tileSize
    )
}

//place good fish on game board
function placeGoodFish(){
    do {
        //random coordinates for good fish
        let goodCoord =Math.floor(Math.random() * tileCount);
        fishGoodX =goodCoord;
        fishGoodY = goodCoord;
    } while (isFishOverlap(fishGoodX, fishGoodY));
}

//good fish collision check
function checkGoodFishCollion() {
    if (fishGoodX === headX && fishGoodY === headY) {
        playEatSound();
        // handleFishCollision
        // fishGoodX = Math.floor(Math.random() * tileCount);
        // fishGoodY = Math.floor(Math.random() * tileCount);
        //handle tail length and score
        score ++;
        tailLength++;
        placeGoodFish();
    }
  }

//create magical fish
function drawMagicalFish(){
    ctx.drawImage(
        magicalFishImg,
        fishMagicalX * tileCount,
        fishMagicalY * tileCount,
        tileSize,
        tileSize
    )
}

//random coordinates to generate magical fish
function placeMagicalFish(){
    do {
        //random coordinates for magical fish
        let magicalCoord = Math.floor(Math.random() * tileCount)
        fishMagicalX = magicalCoord;
        fishMagicalY = magicalCoord;
        // fishMagicalX = Math.floor(Math.random() * tileCount);
        // fishMagicalY = Math.floor(Math.random() * tileCount);
    } while (isFishOverlap(fishMagicalX, fishMagicalY));
}

//magical fish collision
function checkMagicalFishCollision() {
    if (fishMagicalX === headX && fishMagicalY === headY) {
        playEatSound();
        //handle tail length and score
        score += randomScore;
        tailLength++
        placeMagicalFish();
    }
  }

//create bad fish
function drawBadFish(){
    ctx.drawImage(
        badFishImg,
        fishBadX * tileCount,
        fishBadY * tileCount,
        tileSize,
        tileSize
    )
}

// random coordinates to generate bad fish
function placeBadFish(){
    do {
        //random coordinates for bad fish
        let badCoord = Math.floor(Math.random() * tileCount)
        fishBadX = badCoord;
        fishBadY = badCoord;
        // fishBadX = Math.floor(Math.random() * tileCount);
        // fishBadY = Math.floor(Math.random() * tileCount);
    } while (isFishOverlap(fishBadX, fishBadY));
}

// bad fish collision check
function checkBadFishCollision() {
    if (fishBadX === headX && fishBadY === headY) {
        playBFSound()
        //handle tail length and score
        score -= 20;
        tailLength += randomScore;
        placeBadFish();
    if (score < 0){
        return gameOver;
    }
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

    //redraw game
    drawGame();
}



//KEY DIRECTIONS CONTROLS
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

//set background music to pause
function pauseBackgroundSound(){
    backgroundSound.pause();
}

//buttons audio function
function playBtnSound(){
    const btnSound = new Audio('../audio/game-buttons.mp3');
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


//start audio function
function playStartSound(){
    const startSound = new Audio('../audio/game-decide.mp3');
    if(!startSound.paused){
        startSound.currentTime = 0;// Resetting the audio to the beginning
    }
    startSound.play().then(() => {
        console.log('[sound of game starting...]');
    }).catch(error => {
        console.error('Error starting sound', error);
    });
}


//eat audio function
function playEatSound(){
    const eatSound = new Audio('../audio/game-eat.mp3');
    eatSound.play().then(() => {
        console.log('[sound of cat eating...]');
    }).catch(error => {
        console.error('Error eat sound', error);
    });
}

//eat bad fish audio function
function playBFSound(){
    const badFishSound = new Audio('../audio/game-badfish.mp3');
    if(!badFishSound.paused){
        badFishSound.currentTime = 0;// Resetting the audio to the beginning
    }
    badFishSound.play().then(() => {
        console.log('[cat ate bad fish...]');
    }).catch(error => {
        console.error('Error bad fish eat sound', error);
    });
}

//gameover sound function
const goSound = new Audio('../audio/game-end.mp3');
function playGoSound(){
    goSound.play();
}

// date bar on the left top side of screen
const currentDate= new Date();
$('#time-date').text(`${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`);
$('#date-date').text(`${currentDate.getFullYear()} ${currentDate.getMonth() + 1} ${currentDate.getDate()}`);

//timer variables
let timerInterval;
let seconds = 0;
let minutes = 0;
let finalTime = '';

//start game timer function and updates timer in game board
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

//stop game timer function
function stopTimer() {
    clearInterval(timerInterval);
    finalTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateGameoverScreen();
}

//update timer in game screen
function updateTimerDisplay() {
    $('#timer').html(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
}

//reset game timer
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

    //Loop through each cat profile
    catProfiles.forEach(cat => {
        //event listener for mouse enter on each cat profile
        cat.addEventListener('mouseenter', function(){
            playBtnSound(); //trigger button sound function
        });
        //add event listener for click on each cat profile 
        cat.addEventListener('click', function() {
            catProfiles.forEach(cat => { 
                 // If the current cat profile is not the one clicked, remove the 'clicked' class
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
// const border = document.getElementById("cat-canvas");

//fish intervals to be set in pressPlay
let goodInterval;
let badInterval;
let magicalInterval;


function pressPlay(){
    //toggles state of game when clicked
    gameControls.isRunning = true;

    //changes button text to Pause
    $(playBtn).text("⏸ Pause");
    // remove and add styling of play pause button 
    $(playBtn).removeClass("play").addClass("pause");
    // remove and add styling of cat animation profile to red for play
    $('#cat-canvas').removeClass("c-pause").addClass("c-play");
    //profile cat animation runs when play is clicked
    newCatAnimation.startAnimation();
    if (!gameInterval){
        drawGame(); 
    }

    //start intervals for placing different fish types if not already started
    if (!goodInterval) {
        goodInterval = setInterval(placeGoodFish, 9000);
    }

    if (!badInterval) {
        badInterval = setInterval(placeBadFish, 2000);
    }
    if (!magicalInterval) {
        magicalInterval = setInterval(placeMagicalFish, 3000);
    }
    //start game timer
    startTimer();
}

function pressPause(){
    //toggles the state of game when clicked
    gameControls.isRunning = false;
    $(playBtn).text("▶ Play");
    // remove and add styling of play pause button 
    $(playBtn).removeClass("pause").addClass("play");
    // remove and add styling of cat animation profile to red for pause
    $('#cat-canvas').removeClass("c-play").addClass("c-pause");
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

//MAIN GAME LOOP
function drawGame(){ 
    //check if game is running
    if (gameControls.isRunning){
        //set timeout for game loop based on speed
        gameInterval = setTimeout(drawGame, 1000 / speed);
        changeCatPosition(); 
    
    let result = isGameOver();
    if(result){
        //display, reset, and switch to game over screen 
        displayScore()
        resetGame();
        stopTimer();
        gameControls.switchScreen('gameover-screen');
        playGoSound();
    }
    clearScreen(); 
    currentScore();

    //draw different types of fish
    drawGoodFish();
    drawMagicalFish();
    drawBadFish();

    //collision check for fish types
    checkGoodFishCollion();
    checkMagicalFishCollision();
    checkBadFishCollision();

    //draw cat and update game speed
    drawCat(); 
    updateSpeed();
    }
}