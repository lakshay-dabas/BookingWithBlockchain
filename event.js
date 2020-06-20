const Web3 = require('web3');
const web3 = new Web3('wss://ropsten.infura.io/ws/v3/96beb9df66384d07991430e7fa44a4a2');
const Tx = require('ethereumjs-tx'); //module for creating, manipulating and signing transaction

const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_firstName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_lastName",
				"type": "string"
			}
		],
		"name": "memberAdded",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_firstName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_lastName",
				"type": "string"
			}
		],
		"name": "addPeople",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "count",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "giveCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "people",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_firstName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_lastName",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
const privateKey = '8e05ecf21d5c508b6886c17685954989bff3f0fd9b51c03407af5d425fe0f25d';
const PRIVATE_KEY_1 = Buffer.from(privateKey,'hex');//convert in hex form
// console.log(PRIVATE_KEY_1)
const contractAddress = '0x246d8D9185D1B94897d0D560497613193e66Ea75';
const account = web3.eth.accounts.privateKeyToAccount(privateKey)

// console.log(account);

web3.eth.defaultAccount  = account.address;

const contract = new web3.eth.Contract(abi, contractAddress);


contract.events.memberAdded({fromBlock : 8124353})
	.on('data', event => console.log(event));


const func = contract.methods.addPeople('vipin','yadav');

const funcAbi = func.encodeABI();
console.log(funcAbi);

// contract.methods.count().call()
//     .then(res => console.log(res))
//     .catch(err => console.log(err));
// // console.log(contract.methods.addPeople('vipin','yadav'))
// contract.methods.addPeople('vipin','yadav').send({from : '0x6D1B479aB3E2b95884bA2499179e958E13ce3610'})
//     .then(res =>{
//         console.log(res);
//     })
//     .catch(err => console.log(err));


web3.eth.getTransactionCount(account.address)
    .then(txCount => {
        console.log(txCount);
        const txObject = {
            nonce : web3.utils.toHex(txCount),
            to : contractAddress,
            data : funcAbi,
            // value : web3.utils.toHex(web3.utils.toWei('0.1','ether')),
            gasLimit : web3.utils.toHex(2100000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10','gwei'))
        }
        const tx = new Tx(txObject);
        tx.sign(PRIVATE_KEY_1);

        const serializedTransaction = tx.serialize();//converting object to bytes form, so that it   can be saved in memory/db and 
        //by serialized form of object we can re instantiate object easily 
        const raw = '0x' + serializedTransaction.toString('hex');
        // console.log(raw);
        web3.eth.sendSignedTransaction(raw)
            .then(info => console.log('info'))
            .catch(err => console.log(err));
    })
	.catch(err => console.log(err));
