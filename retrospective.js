const imageProc = require('./image');
const Web3 = require('web3');
const Jimp = require('jimp');
const fs = require("fs");

const web3 = new Web3('wss://bsc-testnet.publicnode.com');

const contract = new web3.eth.Contract(JSON.parse(fs.readFileSync("./ABI.json")), '0x36c7e3b5D136635202F0392235C15cF537042167');

async function getEvents() {
    let latest_block = await web3.eth.getBlockNumber();
    console.log(latest_block)
    let historical_block = Math.max(latest_block - 10000, 0); // you can also change the value to 'latest' if you have a upgraded rpc
    console.log("latest: ", latest_block, "historical block: ", historical_block);
    const events = await contract.getPastEvents(
        'UpdateTile', // change if your looking for a different event
        {fromBlock: 5, toBlock: 'latest'}
    );
    for (let i = 0; i < events.length; i++) {
        const IMAGE_URL = `data:image/png;base64,${events[i].returnValues.image}=`;

        const imageData = IMAGE_URL.split(',').pop();

        const image = await Jimp.read(Buffer.from(imageData, 'base64'));

        await imageProc(events[i].returnValues._x, events[i].returnValues._y, image);
    }

    process.exit(0);
}


getEvents();

