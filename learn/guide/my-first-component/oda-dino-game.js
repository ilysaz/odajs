import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
import "./oda-pterodactyl.js";

function createCloud(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement('oda-cloud'));
}

function createCactus(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement('oda-cactus'));
}

function createPterodactyl(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement('oda-pterodactyl'));
}

let scoreID;

function startGame() {
    const gameOver = document.querySelector('#game-over');

    gameOver.style.display = "none";
    gameOver.innerText = "Game Over";

    const audio = document.querySelector('audio');
    audio.play();

    scoreID = setInterval(() => {
        score.textContent = +score.textContent + 1;
    }, 100);

    document.removeEventListener('keyup', startGameKeyUp);

    document.addEventListener('keydown', dinoJumpKeyDown);

    requestAnimationFrame(checkDino);
}

function continueGame() {

    const gameOver = document.querySelector('#game-over');
    gameOver.style.display = "none";



    const cactuses = document.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.remove();
    });

    cactusDistance = 0;
    nextCactusDistance = 0;

    const dino = document.querySelector('oda-dino');
    dino.continueMove();

    const clouds = document.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.continueMove();
    });

    const pterodactyls = document.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.continueMove();
    });

    const score = document.getElementById('score');
    score.textContent = 0;
    scoreID = setInterval(() => {
        score.textContent = +score.textContent + 1;
    }, 100);

    const audio = document.querySelector('audio');
    audio.play();

    document.removeEventListener('keyup', continueGameKeyUp);

    document.addEventListener('keydown', dinoJumpKeyDown);

    requestAnimationFrame(checkDino);
}

function startGameKeyUp(e) {
    if (e.code === 'Space') {
        startGame();
    }
}

function continueGameKeyUp(e) {
    if (e.code === 'Space') {
        continueGame();
    }
}

function dinoJumpKeyDown(e) {
    if (e.code === 'Space') {
        dino.jump();
    }
}

document.addEventListener('keyup', startGameKeyUp);

let cloudDistance = 0;
let nextCloudDistance = 0;

let cactusDistance = 0;
let nextCactusDistance = 0;

let pterodactylDistance = 0;
let nextPterodactylDistance = 0;

function checkDino() {
    cloudDistance++;
    if (cloudDistance > nextCloudDistance) {
        cloudDistance = 0;
        createCloud();
        nextCloudDistance = Math.floor(20 + Math.random() * (150 + 1 - 20));
    }

    cactusDistance++;
    if (cactusDistance > nextCactusDistance) {
        cactusDistance = 0;
        createCactus();
        nextCactusDistance = Math.floor(100 + Math.random() * (150 + 1 - 100));
    }

    pterodactylDistance++;
    if (pterodactylDistance > nextPterodactylDistance) {
        pterodactylDistance = 0;
        createPterodactyl();
        nextPterodactylDistance = Math.floor(150 + Math.random() * (200 + 1 - 150));
    }

    let cactuses = document.querySelectorAll('oda-cactus');

    for (var i = 0; i < cactuses.length; ++i) {
        if (dino.isIntersection && dino.isIntersection(cactuses[i])) {
            gameOver();
            return;
        }
    }

    requestAnimationFrame(checkDino);
}

function gameOver() {

    document.querySelector('#game-over').style.display = "";

    clearInterval(scoreID);

    const dino = document.querySelector('oda-dino');
    dino.stopMove();

    const clouds = document.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.stopMove();
    });

    const cactuses = document.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.stopMove();
    });

    const pterodactyls = document.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.stopMove();
    });

    const audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.pause();

    document.removeEventListener('keydown', dinoJumpKeyDown);

    document.addEventListener('keyup', continueGameKeyUp);
}