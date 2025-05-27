import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

// TODO: Client logic here -> necessary to require socket.io
const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const players = []

socket.on('player', (data) => {
    const id = data.currentUsers;
    players.push(new Player({ x: 50, y: 50, score: 0, id }));
});

