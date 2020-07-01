//impor required modules
const Web3 = require('web3');
const web3 = new Web3('wss://ropsten.infura.io/ws/v3/96beb9df66384d07991430e7fa44a4a2');
const Tx = require('ethereumjs-tx'); //module for creating, manipulating and signing transaction
const { connect } = require('mongoose');
require('dotenv').config();

//self made modules
const {bookRoom,hotelAgreeToPay} = require('./smartContractHelper');
const abi = require('./abi');

//DB import 
const roomModel = require('./model/room');
const customerModel = require('./model/customer');
const { eventNames } = require('./model/booking');

//environment variables
const privateKey = process.env.PRIVATE_KEY;
const PRIVATE_KEY_1 = Buffer.from(privateKey,'hex');//convert in hex form
const contractAddress = process.env.CONTRACT_ADDRESS;
const account = web3.eth.accounts.privateKeyToAccount(privateKey)
web3.eth.defaultAccount  = account.address;

//make contract pbject
const contract = new web3.eth.Contract(abi, contractAddress);

//EVENT LISTENERS

const eventListener = () => {
	//TESTING NEEDED
	contract.events.customerPaidBookingAmount({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			//see if roomType required by customer is empty, if empty allocated him a one
			const roomType = event.returnValues.roomType;
			let roomAlloted = -1;		
	
			roomModel.findOne({type : roomType, booked : false})
				.then(room => {
					roomAlloted = room.id;
					room.booked = true;
					room.save();
				})
			if (roomAlloted == -1){
				return;
			}
			hotelAgreeToPay(event.returnValues.contractId, roomAlloted);
		})
	//TESTING NEEDED
	contract.events.hotelPaidTenPercentOfBookingAmount({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			//we can make a flag i booking DB, denoting that now user can submit the pin and conform the booking
			const email = event.returnValues.email;
			const contractId = event.returnValues.contractId;
			customerModel.findOne({email})
				.then(customer => {
					customer.booking.id(contractId)
						.then(booking => {
							booking.finalStep = true;  //this indicate now customer can submit pin
							customer.save();
						})
						.catch(err  => console.log(err));
				})
				.catch(err => console.log(err));
		})

	//TESTING NEEDED
	contract.events.pinChecked({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			const contractId = event.returnValues.contractId;
			const email = event.returnValues.email;

			customerModel.findOne({email})
				.then(customer => {
					customer.booking.id(event.returnValues.contractId)	
						.then(booking => {
							booking.status = "Booking confirmed";
							customer.save();
						})
						.catch(err => console.log(err));
				})
				.catch(err => console.log(err));
		})

	//TESTING NEEDED
	contract.events.hotelCancelledBooking({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			//get roomId, make it free and update customer booking status to cancelled by hotel
			const roomAlloted = event.returnValues.roomId;
			const email = event.returnValues.email; //PROBLEM need to decrypt it 
			roomModel.findOne({id : roomAlloted})
				.then(room => {
					room.booked = false;
					room.save();
				})
				.catch(err => console.log(err));
			
			customerModel.findOne({email})
				.then(customer => {
					customer.booking.id(event.returnValues.contractId)	
						.then(booking => {
							booking.status = "Cancelled by hotel";
							customer.save();
						})
						.catch(err => console.log(err));
				})
				.catch(err => console.log(err));

		})

	//TESTING NEEDED
	contract.events.customerCancelledBooking({fromBlock : 8124353})
		.on('data', event => {
			console.log(event);
			const roomAlloted = event.returnValues.roomId;
			const email = event.returnValues.email; //PROBLEM need to decrypt it 
			roomModel.findOne({id : roomAlloted})
				.then(room => {
					room.booked = false;
					room.save();
				})
				.catch(err => console.log(err));
			
			customerModel.findOne({email})
				.then(customer => {
					customer.booking.id(event.returnValues.contractId)	
						.then(booking => {
							booking.status = "Cancelled by customer";
							customer.save();
						})
						.catch(err => console.log(err));
				})
				.catch(err => console.log(err));

			})
}