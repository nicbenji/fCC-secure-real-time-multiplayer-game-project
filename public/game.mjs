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
let currentPlayers = {};
let running = false;

socket.on('gameState', ({ players, candy, playerId }) => {
    currentPlayers = getCurrentPlayers(players);
    if (!running) {
        currentCandy = getNewCandy(candy);
        currentPlayer = currentPlayers[playerId];

        displayRank(players);

        window.requestAnimationFrame(gameLoop);
        running = true;
    }
});

socket.on('positions', (players) => {
    for (const id in players) {
        if (currentPlayers[id]) {
            currentPlayers[id].x = players[id].x;
            currentPlayers[id].y = players[id].y;
        }
    }
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
    }
});

socket.on('playerLeft', ({ players, id }) => {
    delete currentPlayers[id];
    displayRank(players);
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

    for (const id in currentPlayers) {
        const player = currentPlayers[id];
        const img = (id === currentPlayer.id) ? playerImg : enemyImg;
        player.draw(context, img);
    }
    currentCandy.draw(context, candyImg);

    if (currentPlayer.collision(currentCandy)) {
        socket.emit('collected', {
            id: currentPlayer.id,
            value: currentCandy.value
        });
    }

    window.requestAnimationFrame(gameLoop);
}

function getCurrentPlayers(players) {
    const playerMap = {};
    for (const id in players) {
        const player = players[id];
        playerMap[id] = new Player({
            x: player.x,
            y: player.y,
            score: player.score,
            id: player.id
        });
    }
    return playerMap;
}

function getNewCandy(candy) {
    return new Collectible({
        x: candy.x,
        y: candy.y,
        value: candy.value,
        id: candy.id
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

