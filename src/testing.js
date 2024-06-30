import axios from 'axios';
import {
    // bufferToHex,
    // toBuffer
} from "./utils.js";

import * as proto from "./proto/models_pb.js";

// URL of the local node via which to send transactions (replace with your actual node url)
const NODE_URL = 'http://localhost:9119';

// API key for accessing the node (replace with your actual node API key)
const API_KEY = '768dqweyipthba5wg1o71oj4xopu8n9';

const ADDRESS = '0x71eecdf6414eda0be975c2b748a74ca5018460e4';

// Fetches the current epoch number
async function getEpoch() {
    const response = await axios.post(NODE_URL, {
        jsonrpc: '2.0',
        method: 'dna_epoch',
        params: [],
        id: 1,
        key: API_KEY
    });
    return response.data.result.epoch;
}

// Fetches the nonce for a given address
async function getNonce(address) {
    const response = await axios.post(NODE_URL, {
        jsonrpc: '2.0',
        method: 'dna_getBalance',
        params: [address],
        id: 1,
        key: API_KEY
    });
    return response.data.result.nonce;
}

async function getRawTx(type, from, to, amount, maxfee, nonce, epoch) {
    const response = await axios.post(NODE_URL, {
        jsonrpc: '2.0',
        method: 'bcn_getRawTx',
        params: [{ type, from, to, amount, maxfee, nonce, epoch }],
        id: 1,
        key: API_KEY
    });
    return response.data.result;
}

const epoch = await getEpoch();
console.log(epoch);

const nonce = await getNonce("0x71eecdf6414eda0be975c2b748a74ca5018460e4");
console.log(nonce);

const amount = 0.01;
const maxFee = 2;

// const amountBytes = toBuffer(amount);
// const maxFeeBytes = toBuffer(maxFee);

// const tx = proto.encodeProtoTransaction({
//     data: {
//         type: 12,
//         to: ADDRESS.buf,
//         amount: amountBytes,
//         maxFee: maxFeeBytes,
//         nonce: nonce + 1,
//         epoch: epoch,
//     },
// });



const rawTx = await getRawTx(12, "0x71eecdf6414eda0be975c2b748a74ca5018460e4", "0x94f90722672423f6e7084a5121bad60f1e8be6ca", 0.01, 1, nonce + 1, epoch);
console.log(rawTx);

// const serialized = bufferToHex(rawTx);

// console.log(serialized);