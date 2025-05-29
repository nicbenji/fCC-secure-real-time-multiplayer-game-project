require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const helmet = require('helmet');
const socket = require('socket.io-client/lib/socket.js');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet({
    frameguard: { actions: 'deny' },
    noCache: true
}));
app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "PHP 7.4.3");
    next();
});

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' }));

// Index page (static HTML)
app.route('/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function(req, res, next) {
    res.status(404)
        .type('text')
        .send('Not Found');
});

// Server socket
let scores = [];
let candy;
io.on('connection', (socket) => {
    console.log('A user has connected ' + socket.id);
    scores = scores.filter(p => p.id !== socket.id);
    scores.push({ score: 0, id: socket.id });
    io.emit('player', {
        id: socket.id,
        scores
    });

    socket.on('score', (player) => {
        const idx = scores.findIndex((p) => p.id === player.id);
        if (idx === -1) {
            scores.push(player);
        } else {
            scores[idx] = player;
        }
        io.emit('scores', scores);
        console.log(scores);
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected.');
        const idx = scores.findIndex((player) => player.id === socket.id);
        if (idx !== -1) {
            scores.splice(idx, 1);
        }
        io.emit('playerLeft', {
            id: socket.id,
            scores
        });
    });
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
http.listen(portNum, () => {
    console.log(`Listening on port ${portNum}`);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function() {
            try {
                runner.run();
            } catch (error) {
                console.log('Tests are not valid:');
                console.error(error);
            }
        }, 1500);
    }
});

module.exports = app; // For testing
