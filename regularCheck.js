const Web3 = require('web3');
const web3 = new Web3('wss://ropsten.infura.io/ws/v3/96beb9df66384d07991430e7fa44a4a2');
const Tx = require('ethereumjs-tx'); //module for creating, manipulating and signing transaction

const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "customerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contractId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "roomId",
				"type": "uint32"
			}
		],
		"name": "customerCancelledBooking",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contractId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "customerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "roomId",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			}
		],
		"name": "customerPaidBookingAmount",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "hotelAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contractId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "roomId",
				"type": "uint32"
			}
		],
		"name": "hotelCancelledBooking",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contractId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "hotelPaidTenPercentOfBookingAmount",
		"type": "event"
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
		"name": "allContracts",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "customerAddress",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "hotelAddress",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "roomId",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			},
			{
				"internalType": "enum hotelContract.State",
				"name": "state",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_roomId",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "_startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_endDate",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_hotelAddress",
				"type": "address"
			}
		],
		"name": "bookRoom",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contractId",
				"type": "uint256"
			}
		],
		"name": "cancelBookingByCustomer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contractId",
				"type": "uint256"
			}
		],
		"name": "cancelBookingByHotel",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contractId",
				"type": "uint256"
			}
		],
		"name": "checkIn",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "countExpiredContract",
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
		"constant": false,
		"inputs": [],
		"name": "deleteExpiredContracts",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contractId",
				"type": "uint256"
			}
		],
		"name": "hotelAgreeToPay",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	}
]


const privateKey = '8e05ecf21d5c508b6886c17685954989bff3f0fd9b51c03407af5d425fe0f25d';
const PRIVATE_KEY_1 = Buffer.from(privateKey,'hex');//convert in hex form
// console.log(PRIVATE_KEY_1)
const contractAddress = '0x9138c2478c9f76433B77ee5F62ED1C3b8C901c46';
const account = web3.eth.accounts.privateKeyToAccount(privateKey)

// console.log(account);

web3.eth.defaultAccount  = account.address;

const contract = new web3.eth.Contract(abi, contractAddress);

contract.events.customerPaidBookingAmount({fromBlock : 8124353})
    .on('data', event => console.log(event))

contract.events.hotelPaidTenPercentOfBookingAmount({fromBlock : 8124353})
    .on('data', event => console.log(event))

contract.events.hotelCancelledBooking({fromBlock : 8124353})
    .on('data', event => console.log(event))


contract.events.customerCancelledBooking({fromBlock : 8124353})
.on('data', event => console.log(event))

const func = contract.methods.countExpiredContract();

const funcAbi = func.encodeABI();
console.log(funcAbi);

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
            .then(info => console.log(info))
            .catch(err => console.log(err));
    })
	.catch(err => console.log(err));
