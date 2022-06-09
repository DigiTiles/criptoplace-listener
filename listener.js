const imageProc = require('./image');
const Web3 = require('web3');
const Jimp = require('jimp');
const fs = require("fs");

const web3 = new Web3('ws://127.0.0.1:8545');


const contract = new web3.eth.Contract(JSON.parse(fs.readFileSync("./ABI.json")), '0x61c7230977b55DfaB8363E68F9536B88443af98F');

async function getEvents() {
    contract.events.UpdateTile(async (err, data) => {
        if (err) {
            console.error(err);
            return
        }
        const IMAGE_URL = `data:image/png;base64,${data.returnValues.image}`;

        const imageData = IMAGE_URL.split(',').pop();

        const image = await Jimp.read(Buffer.from(imageData, 'base64'));

        await imageProc(data.returnValues._x, data.returnValues._y, image);
    });
}


getEvents();

