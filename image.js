const Jimp = require("jimp");
const fs = require("fs");

const tilesPath = './tiles';

const zeroPoint = 33554432;

async function imageProc(_x, _y, imageGet) {
    const image = new Jimp(16, 16, 0xffffffff);
    await image.composite(imageGet, 0, 0);

    console.log(_x, _y);

    for (let i = 26; i >= 20; i--) {
        const perTile = Math.pow(2, 26 - i);
        const x = zeroPoint / perTile + Math.floor(parseInt(_x) / perTile);
        const y = zeroPoint / perTile + Math.floor(parseInt(_y) / perTile);
        const fileName = `${tilesPath}/${i}x${x}x${y}.png`;
        const tileImage = fs.existsSync(fileName) ?
            await Jimp.read(fileName) :
            new Jimp(256, 256, 0xffffffff);
        const newImage = await image.clone();
        const imageWidthOnTile = Math.round(256 / perTile);
        if (i < 22) {
            await newImage.resize(imageWidthOnTile, imageWidthOnTile);
        } else {
            await newImage.resize(imageWidthOnTile, imageWidthOnTile, Jimp.RESIZE_NEAREST_NEIGHBOR);
        }
        const posOnTileX = parseInt(_x) % perTile;
        const posOnTileY = parseInt(_y) % perTile;
        await tileImage.composite(newImage, (posOnTileX + (posOnTileX < 0 ? perTile : 0)) * imageWidthOnTile, (posOnTileY + (posOnTileY < 0 ? perTile : 0)) * imageWidthOnTile);
        await tileImage.write(fileName);
    }
}

module.exports = {imageProc}

