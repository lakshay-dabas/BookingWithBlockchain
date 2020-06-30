const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/96beb9df66384d07991430e7fa44a4a2');

const Tx = require('ethereumjs-tx'); //module for creating, manipulating and signing transaction
require('dotenv').config()


//db import
const customerModel = require('./model/customer');
const roomModel = require('./model/room');

// let cweb3;
// if(global.ethereum){
// 	cweb3 = new Web3(global.ethereum);
// 	( async () => {
// 		await global.ethereum.enable();
// 	})();
// }
// else{
// 	console.log('install metamask');
// }

function sendTransactionMetamask(funcAbi, contractAddress, account){
	web3.eth.sendTransaction({to : contractAddress, value :  web3.utils.toHex(web3.utils.toWei('0.001','ether'))})
    .then(res => console.log(res))
    .catch(err => console.log(err));
}


function sendTransaction(funcAbi,contractAddress,PRIVATE_KEY_1,account, roomId) {
	web3.eth.getTransactionCount(account.address)
		.then(txCount => {
			console.log(txCount);
			const txObject = {
				nonce : web3.utils.toHex(txCount),
				to : contractAddress,
				data : funcAbi,
				value : web3.utils.toHex(web3.utils.toWei('0.001','ether')),
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
		.catch(err => {
			console.log(err);

			//some error occured make that room free again
			roomModel.findOne({id : room})
				.then(room => {
					room.booked = false;
					room.save();
				})
		});
	}



const abi = require('./abi');

const PRIVATE_KEY_1 = Buffer.from(process.env.PRIVATE_KEY,'hex');//convert in hex form

const contractAddress = '0x1142510Eab39FE0BD8B033A80B2e34431C38DD64';
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
// web3.eth.defaultAccount  = account.address;
const contract = new web3.eth.Contract(abi, contractAddress);
// console.log(account);

function bookRoom(startDate, endDate, roomType, amount){
	if (typeof global.web3 !== 'Undefined') {
		console.log(web3.eth.accounts);
		console.log(web3.eth.defaultAccount);
		// web3.eth.sendTransaction({from : web3.eth.account[0] , to: contractAddress, value : web3.utils.toHex(web3.utils.toWei('0.001','ether')) }, function(error, result) {
		// });
	}
	else{
		console.log('install metamask');
		return false;
	}

	const sd =new Date(startDate);
	const ed = new Date(endDate);
	if (sd == 'Invalid Date'|| ed == 'Invalid Date'){
		console.log('invalid date')
		return 0;
	}
	console.log([roomId,sd.getTime(),ed.getTime(),process.env.HOTEL_ADDRESS]);
	const func = contract.methods.bookRoom(roomType,sd.getTime(),ed.getTime(),process.env.HOTEL_ADDRESS);
	const funcAbi = func.encodeABI();
	sendTransactionMetamask(funcAbi, contractAddress, amount); //PROBLEM

	return true;
}

function hotelAgreeToPay(contractId,roomId){
	const func = contracts.methods.hotelAgreeToPay(contractId,roomId);
	const funcAbi = func.encodeABI();
	
	//make it book, so that another member cant start booking transaction on same room
	roomModel.findOne({id : roomId})
	.then(room => {
		room.booked = true;
		room.save();
	})
	.catch(err => console.log(err));

	sendTransaction(funcAbi, contractAddress, PRIVATE_KEY_1, account,roomId);
}

module.exports = {bookRoom,hotelAgreeToPay};