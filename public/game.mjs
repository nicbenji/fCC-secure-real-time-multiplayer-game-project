import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
const playerImg = new Image();
playerImg.src = '../public/Player.png';
const enemyImg = new Image();
enemyImg.src = '../public/Enemy.png';
const candyImg = new Image();
candyImg.src = '../public/Candy.png';

let player, candy;
let running = false;

socket.on('player', (data) => {
    if (!running && playerImg.complete && enemyImg.complete && candyImg.complete) {
        player = generateRandomPlayer(data.id);
        candy = generateRandomCandy(0, player);

        displayRank(data.scores);

        window.requestAnimationFrame(gameLoop);
        running = true;
    }
});

socket.on('scores', (scores) => {
    displayRank(scores);
});

socket.on('playerLeft', (data) => {
    displayRank(data.scores);
});

function gameLoop() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const speed = 3;
    if (currentDir) {
        player.movePlayer(currentDir, speed);
    }
    context.drawImage(playerImg, player.x, player.y, player.sizeX, player.sizeY);
    context.drawImage(candyImg, candy.x, candy.y, candy.sizeX, candy.sizeY);

    if (player.collision(candy)) {
        candy = generateRandomCandy(0, player);
        context.drawImage(candyImg, candy.x, candy.y, candy.sizeX, candy.sizeY);
        const playerInfo = {
            score: player.score,
            id: player.id
        };
        socket.emit('score', playerInfo);
    }

    window.requestAnimationFrame(gameLoop);
}

const keydirections = {
    'w': 'up',
    'arrowup': 'up',
    'a': 'left',
    'arrowleft': 'left',
    's': 'down',
    'arrowdown': 'down',
    'd': 'right',
    'arrowright': 'right'
}
let currentDir = undefined;

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    const dir = keydirections[event.key.toLowerCase()];
    if (dir) {
        currentDir = dir;
    }
});

document.addEventListener('keyup', (event) => {
    event.preventDefault();
    const dir = keydirections[event.key.toLowerCase()];
    if (dir && currentDir === dir) {
        currentDir = undefined;
    }
});

function generateRandomCandy(id, player) {
    // Beutiful magic numbers: canvas dims w/o candy dims
    const candyX = randomInt(0, 630);
    const candyY = randomInt(0, 470);
    const value = randomInt(2, 15);
    const randomCandy = new Collectible({ x: candyX, y: candyY, value, id });
    const playerIsOffItem =
        player.x > randomCandy.x + randomCandy.sizeX ||
        player.x + player.sizeX < randomCandy.x ||
        player.y > randomCandy.y + randomCandy.sizeY ||
        player.y + player.sizeY < randomCandy.y
    if (!playerIsOffItem) {
        generateRandomCandy(id, player);
    }
    return randomCandy;
}
function generateRandomPlayer(id, score = 0) {
    // Beutiful magic numbers: canvas dims w/o player dims
    const playerX = randomInt(0, 610);
    const playerY = randomInt(0, 450);

    const randomPlayer = new Player({ x: playerX, y: playerY, score, id });
    return randomPlayer;
}

function randomInt(minLength, maxLength) {
    const minCeiled = Math.ceil(minLength);
    const maxFloored = Math.floor(maxLength);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function displayRank(arr) {
    const rankParagraph = document.getElementById('rank');
    rankParagraph.innerHTML = player.calculateRank(arr);
}

