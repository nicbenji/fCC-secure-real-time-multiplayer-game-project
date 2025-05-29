class Collectible {

    constructor({ x, y, value, id }) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.id = id;
        this.sizeX = 20;
        this.sizeY = 20;
    }

    draw(context, img) {
        context.drawImage(img, this.x, this.y, this.sizeX, this.sizeY);
    }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
    module.exports = Collectible;
} catch (e) { }

export default Collectible;
