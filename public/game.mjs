import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let player, candy;

socket.on('player', (data) => {
    player = new Player({ x: 120, y: 245, score: 0, id: data.id });
    candy = new Collectible({ x: 510, y: 30, value: 5, id: 0 });

    // TODO: Dummy impl not correct place and rank val
    displayRank(1, data.count);

    window.requestAnimationFrame(gameLoop);
});

function gameLoop() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    if (currentDir) {
        player.movePlayer(currentDir, 1.5);
    }
    player.draw(context);
    candy.draw(context);

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

function displayRank(rank, playerCount) {
    const rankParagraph = document.getElementById('rank');
    rankParagraph.innerHTML = `Rank: ${rank}/${playerCount}`
}

