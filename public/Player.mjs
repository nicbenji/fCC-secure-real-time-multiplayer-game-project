class Player {

    constructor({ x, y, score, id }) {
        this.x = x;
        this.y = y;
        this.score = score ?? 0;
        this.id = id;
        this.sizeX = 30;
        this.sizeY = 30;
    }

    movePlayer(dir, speed) {
        switch (dir) {
            case 'left':
                if (this.x > 0) {
                    this.x -= speed;
                }
                break;
            case 'right':
                if (this.x < 610) {
                    this.x += speed;
                }
                break;
            case 'up':
                if (this.y > 0) {
                    this.y -= speed;
                }
                break;
            case 'down':
                if (this.y < 450) {
                    this.y += speed;
                }
                break;
            default: throw new Error('Invalid player direction');
        }
    }

    collision(item) {
        const playerisOffItem =
            this.x > item.x + item.sizeX ||
            this.x + this.sizeX < item.x ||
            this.y > item.y + item.sizeY ||
            this.y + this.sizeY < item.y;
        if (!playerisOffItem) {
            this.score += item.value;
            return true;
        }
    }

    calculateRank(arr) {
        const players = arr.sort((player1, player2) => player2.score - player1.score);
        for (let i = 0; i < players.length; i++) {
            if (players[i].id === this.id) {
                return `Rank: ${i + 1}/${players.length}`
            }
        }
        return `Rank: ${players.length}/${players.length}`
    }

    draw(context) {
        context.fillStyle = 'cyan';
        context.fillRect(this.x, this.y, this.sizeX, this.sizeY);
    }
}

export default Player;
