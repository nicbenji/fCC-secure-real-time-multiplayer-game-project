class Player {

    constructor({ x, y, score, id }) {
        this.x = x;
        this.y = y;
        this.score = score;
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
        const isOffItem =
            this.x > item.x + item.sizeX ||
            this.x + this.sizeX < item.x ||
            this.y > item.y + item.sizeY ||
            this.y + this.sizeY < item.y;
        if (!isOffItem) {
            this.score += item.score;
            return true;
        }
    }

    calculateRank(arr) {

    }

    draw(context) {
        context.fillStyle = 'cyan';
        context.fillRect(this.x, this.y, this.sizeX, this.sizeY);
    }
}

export default Player;
