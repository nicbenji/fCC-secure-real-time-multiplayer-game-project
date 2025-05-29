module.exports = function serverSocket(io) {
    let players = new Map();
    let candy = generateRandomCandy(0);

    io.on('connection', (socket) => {
        console.log('A user has connected ' + socket.id);
        players.set(socket.id, generateRandomPlayer(socket.id, candy, 0));
        io.emit('gameState', {
            playerId: socket.id,
            players: Object.fromEntries(players),
            candy
        });

        socket.on('moved', ({ id, x, y }) => {
            const player = players.get(id);
            if (!player) return;

            player.x = x;
            player.y = y;
            io.emit('positions', Object.fromEntries(players));
        });

        socket.on('collected', ({ id, value }) => {
            const player = players.get(id);
            if (!player) return;

            const candyId = candy.id + 1;
            candy = generateRandomCandy(candyId);
            player.score += value;
            console.log(player);
            io.emit('scores', { players: Object.fromEntries(players), candy });
        });

        socket.on('disconnect', () => {
            console.log('User has disconnected.');
            players.delete(socket.id);
            io.emit('playerLeft', {
                id: socket.id,
                players: Object.fromEntries(players),
            });
        });
    });
}

function generateRandomCandy(id) {
    // Beutiful magic numbers: canvas dims w/o candy dims
    // Candy gives score between 2 - 15
    return {
        x: randomInt(0, 630),
        y: randomInt(0, 470),
        value: randomInt(2, 15),
        id
    };
}
function generateRandomPlayer(id, currentCandy, score = 0) {
    // Constants implemented here as not dynamically set for current impl
    const candyDim = 20;
    const playerDim = 30;
    // Beutiful magic numbers: canvas dims w/o player dims
    let randomPlayer, playerIsOffItem;
    while (!playerIsOffItem) {
        randomPlayer = {
            x: randomInt(0, 610),
            y: randomInt(0, 450),
            score,
            id
        };
        playerIsOffItem =
            randomPlayer.x > currentCandy.x + candyDim ||
            randomPlayer.x + playerDim < currentCandy.x ||
            randomPlayer.y > currentCandy.y + candyDim ||
            randomPlayer.y + playerDim < currentCandy.y
    }
    return randomPlayer;
}

function randomInt(minLength, maxLength) {
    const minCeiled = Math.ceil(minLength);
    const maxFloored = Math.floor(maxLength);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
