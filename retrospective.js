import { imageProc } from './image.js';
import Web3 from 'web3';
import Jimp from 'jimp';
import fs from 'fs';

const web3 = new Web3('wss://bsc-testnet.publicnode.com');

const contract = new web3.eth.Contract(
    JSON.parse(fs.readFileSync("./ABI.json")),
    '0x3C27c4100dbC3Ee94Eb3600610b0e7A4a6acCf0D'
);

async function getEvents() {
    let latest_block = await web3.eth.getBlockNumber();
    console.log("Latest block:", latest_block);

    const events = await contract.getPastEvents(
        'UpdateTile',
        { fromBlock: Math.max(latest_block - 10000, 0), toBlock: 'latest' }
    );

    for (let event of events) {
        await processEvent(event);
    }

    console.log("Listening for new events...");

    contract.events.UpdateTile()
        .on('data', async (event) => {
            await processEvent(event);
        })
        .on('error', console.error);
}

async function processEvent(event) {
    try {
        console.log("Processing event:", event.returnValues);

        const IMAGE_URL = `data:image/png;base64,${event.returnValues.image}`;
        const imageData = IMAGE_URL.split(',').pop();
        const image = await Jimp.read(Buffer.from(imageData, 'base64'));

        await imageProc(event.returnValues._x, event.returnValues._y, image);
    } catch (err) {
        console.error("Error processing event:", err);
    }
}

getEvents();

