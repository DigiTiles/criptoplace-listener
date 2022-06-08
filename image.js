const Jimp = require("jimp");
const fs = require("fs");

const tilesPath = './tiles';

const zeroX = 268435456;
const zeroY = 134217728;

module.exports = async function (_x, _y, imageGet) {
    const image = new Jimp(16, 16, 0xffffffff);
    image.composite(imageGet, 0, 0);

    console.log(_x, _y);

    for (let i = 26; i >= 20; i--) {
        const perTile = Math.pow(2, 26 - i);
        const x = zeroX / perTile + Math.floor(parseInt(_x) / perTile);
        const y = zeroY / perTile + Math.floor(parseInt(_y) / perTile);
        const fileName = `${tilesPath}/${i}x${x}x${y}.png`;
        const tileImage = fs.existsSync(fileName) ?
            await Jimp.read(fileName) :
            new Jimp(256, 256, 0xffffffff);
        const newImage = await image.clone();
        const imageWidthOnTile = Math.round(256 / perTile);
        if (i < 22) {
            newImage.resize(imageWidthOnTile, imageWidthOnTile);
        } else {
            newImage.resize(imageWidthOnTile, imageWidthOnTile, Jimp.RESIZE_NEAREST_NEIGHBOR);
        }
        const posOnTileX = parseInt(_x) % perTile;
        const posOnTileY = parseInt(_y) % perTile;
        tileImage.composite(newImage, (posOnTileX + (posOnTileX < 0 ? perTile : 0)) * imageWidthOnTile, (posOnTileY + (posOnTileY < 0 ? perTile : 0)) * imageWidthOnTile);
        tileImage.write(fileName);
    }
}

