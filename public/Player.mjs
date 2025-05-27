class Player {

    constructor({ x, y, score, id }) {
        this.x = x;
        this.y = y;
        this.score = score;
        this.id = id;
    }

    // TODO: Fix impl with proper calc of the length of movement ig
    movePlayer(dir, speed) {
        switch (dir) {
            case 'left': this.x - speed;
            case 'right': this.x + speed;
            case 'up': this.y + speed;
            case 'down': this.y - speed;
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
}

export default Player;
