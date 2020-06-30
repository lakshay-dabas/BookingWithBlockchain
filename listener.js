//impor required modules
const Web3 = require('web3');
const web3 = new Web3('wss://ropsten.infura.io/ws/v3/96beb9df66384d07991430e7fa44a4a2');
const Tx = require('ethereumjs-tx'); //module for creating, manipulating and signing transaction
const { connect } = require('mongoose');
const smartContractHelper = require('./smartContractHelper');
require('dotenv').config();


//environment variables
const abi = process.env.ABI;
const privateKey = process.env.PRIVATE_KEY;
const PRIVATE_KEY_1 = Buffer.from(privateKey,'hex');//convert in hex form
const contractAddress = process.env.CONTRACT_ADDRESS;
const account = web3.eth.accounts.privateKeyToAccount(privateKey)
web3.eth.defaultAccount  = account.address;

//make contract pbject
const contract = new web3.eth.Contract(abi, contractAddress);

//EVENT LISTENERS

const eventListener = () => {

	contract.events.customerPaidBookingAmount({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			//its time for hotel to check the contract reuqest and conform it
			//PROBLEM
		})

	contract.events.hotelPaidTenPercentOfBookingAmount({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			//its time to ask user for PIN
			//redirect to a page having booking info and pin enter button
			//PROBLEM
		})

	contract.events.hotelCancelledBooking({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			//get roomId, make it free and update customer booking status to cancelled by hotel
			//PROBLEM
		})


	contract.events.customerCancelledBooking({fromBlock : 8124353})
	.on('data', event => {
		console.log(event);
		//get roomId, make it free and update customer booking status to cancelled by customer
		//PROBLEM
	})
}