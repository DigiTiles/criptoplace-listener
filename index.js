const imageProc = require('./image');
const Web3 = require('web3');
const Jimp = require('jimp');

const web3 = new Web3('ws://127.0.0.1:8545');
// console.log(web3.eth);
const contract = new web3.eth.Contract([
    {
        inputs: [
            {
                internalType: "int256",
                name: "x",
                type: "int256",
            },
            {
                internalType: "int256",
                name: "y",
                type: "int256",
            },
            {
                internalType: "string",
                name: "image",
                type: "string",
            }
        ],
        name: "updateTile",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: 'number',
                name: "_x",
                indexed: true,
                type: "int256",
            },
            {
                internalType: 'number',
                name: "_y",
                indexed: true,
                type: "int256",
            },
            {
                name: "image",
                type: "string",
            }
        ],
        name: "UpdateTile",
        outputs: [],
        type: "event",
    },
], '0x5fbdb2315678afecb367f032d93f642f64180aa3');

async function getEvents() {
    let latest_block = await web3.eth.getBlockNumber();
    console.log(latest_block)
    let historical_block = Math.max(latest_block - 10000, 0); // you can also change the value to 'latest' if you have a upgraded rpc
    console.log("latest: ", latest_block, "historical block: ", historical_block);
    // const events = await contract.getPastEvents(
    //     'UpdateTile', // change if your looking for a different event
    //     { fromBlock: 5, toBlock: 'latest' }
    // );

    console.log(contract.events)

    contract.events.UpdateTile(async (err, data) => {
        if (err) {
            console.error(err);
            return
        }
        const IMAGE_URL = `data:image/png;base64,${data.returnValues.image}=`;

        const imageData = IMAGE_URL.split(',').pop();

        const image = await Jimp.read(Buffer.from(imageData, 'base64'));

        imageProc(data.returnValues._x, data.returnValues._y, image);
    });
}

async function getTransferDetails(data_events) {
    console.log(data_events)
    // for (i = 0; i < data_events.length; i++) {
    //     let from = data_events[i]['returnValues']['from'];
    //     let to = data_events[i]['returnValues']['to'];
    //     let amount = data_events[i]['returnValues']['amount'];
    //     let converted_amount = web3.utils.fromWei(amount);
    //     if (converted_amount > 32) { //checking for transcations with above 32 eth as an example
    //         console.log("From:", from, "- To:", to, "- Value:", converted_amount);
    //     }
    // };
};


getEvents();

