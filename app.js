require('dotenv').config();
const Web3 = require('web3'); //API for client to connect to Ethereum blockchain network
const Tx = require('ethereumjs-tx'); //module for creating, manipulating and signing transaction

const PRIVATE_KEY_1 = Buffer.from(process.env.PRIVATE_KEY_1,'hex');//convert in hex form

const account1 = '0x6D1B479aB3E2b95884bA2499179e958E13ce3610';
const account2 = '0x692991888659c3e8Ad043B262B0AF97415eA4aDB';

const web3 = new Web3('https://ropsten.infura.io/v3/96beb9df66384d07991430e7fa44a4a2'); //web3 is a instance for connection to robsten network

web3.eth.getBalance(account1, function(error, result) {
    console.log('balance if account1', web3.utils.fromWei(result,'ether'));
});

web3.eth.getBalance(account2, function(error, result) {
    console.log('balance if account2', web3.utils.fromWei(result,'ether'));
});

web3.eth.getTransactionCount(account1)
    .then(txCount => {
        console.log(txCount);
        const txObject = {
            nonce : web3.utils.toHex(txCount),
            to : account2,
            value : web3.utils.toHex(web3.utils.toWei('0.1','ether')),
            gasLimit : web3.utils.toHex(21000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10','gwei'))
        }
        const tx = new Tx(txObject);
        tx.sign(PRIVATE_KEY_1);

        const serializedTransaction = tx.serialize();//converting object to bytes form, so that it   can be saved in memory/db and 
        //by serialized form of object we can re instantiate object easily 
        const raw = '0x' + serializedTransaction.toString('hex');
        // console.log(raw);
        web3.eth.sendSignedTransaction(raw)
            .then(info => console.log(info))
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));