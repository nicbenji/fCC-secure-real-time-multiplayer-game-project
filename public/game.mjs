import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
const playerImg = new Image();
playerImg.src = '/public/Player.png';
const enemyImg = new Image();
enemyImg.src = '/public/Enemy.png';
const candyImg = new Image();
candyImg.src = '/public/Candy.png';

let currentPlayer, currentCandy;
let running = false;

socket.on('gameState', (gameState) => {
    if (!running) {
        currentCandy = getNewCandy(gameState);
        currentPlayer = getNewPlayer(gameState);

        displayRank(gameState.players);

        window.requestAnimationFrame(gameLoop);
        running = true;
    }
});

socket.on('playerLeft', (data) => {
    displayRank(data.players);
});

function gameLoop() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const speed = 3;
    if (currentDir) {
        currentPlayer.movePlayer(currentDir, speed);
        // WARNING: Enables cheating because of client-side computation, 
        // not fixing this as fCC requires movePlayer() method this way
        socket.emit('moved', {
            id: currentPlayer.id,
            x: currentPlayer.x,
            y: currentPlayer.y
        });
    }

    currentPlayer.draw(context, playerImg);
    currentCandy.draw(context, candyImg);

    if (currentPlayer.collision(currentCandy)) {
        socket.emit('collected', {
            id: currentPlayer.id,
            value: currentCandy.value
        });
        socket.on('scores', ({ players, candy }) => {
            const player = players[currentPlayer.id];
            if (player) {
                currentPlayer.score = player.score;
                displayRank(players);
            }
            if (candy) {
                currentCandy = new Collectible({
                    x: candy.x,
                    y: candy.y,
                    value: candy.value,
                    id: candy.id
                });
                currentCandy.draw(context, candyImg);
            }
        });
    }

    window.requestAnimationFrame(gameLoop);
}

function getNewPlayer(gameState) {
    const playerData = gameState.players[gameState.playerId];
    return new Player({
        x: playerData.x,
        y: playerData.y,
        score: playerData.score,
        id: playerData.id
    });
}

function getNewCandy(gameState) {
    const candyData = gameState.candy;
    return new Collectible({
        x: candyData.x,
        y: candyData.y,
        value: candyData.value,
        id: candyData.id
    });
}

function displayRank(players) {
    const header = document.getElementById('rank');
    const playerArr = Object.values(players);
    header.innerHTML = currentPlayer.calculateRank(playerArr);
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

