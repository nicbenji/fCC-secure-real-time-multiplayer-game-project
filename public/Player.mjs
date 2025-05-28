class Player {

    constructor({ x, y, score, id }) {
        this.x = x;
        this.y = y;
        this.score = score;
        this.id = id;
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
        if (item.x === this.x && item.y === this.y) {
            // TODO: Remove collectible from canvas
            // Increase player score
            return true;
        }
    }

    calculateRank(arr) {

    }

    draw(context) {
        context.fillStyle = 'cyan';
        context.fillRect(this.x, this.y, 30, 30);
    }
}

export default Player;
