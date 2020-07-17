//impor required modules
const Web3 = require('web3');
const web3 = new Web3('wss://ropsten.infura.io/ws/v3/96beb9df66384d07991430e7fa44a4a2');
const Tx = require('ethereumjs-tx'); //module for creating, manipulating and signing transactio
const nodeRSA = new require('node-rsa');
require('dotenv').config();

//self made modules
const abi = require('./abi');
const sendEmail = require("./email");
const {allKeys} = require('./keys');
const bookingModel = require('./model/booking');

const allKeysObject = new allKeys();

//environment variables
// const privateKey = process.env.PRIVATE_KEY;
// const PRIVATE_KEY_1 = Buffer.from(privateKey,'hex');//convert in hex form
// const contractAddress = process.env.CONTRACT_ADDRESS;
// const account = web3.eth.accounts.privateKeyToAccount(privateKey)
// web3.eth.defaultAccount  = account.address;

//make contract pbject
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

//EVENT LISTENERS

const eventListener = () => {
	//TESTING NEEDED
	contract.events.customerPaidBookingAmount({fromBlock : process.env.BLOCK_NUMBER})
		.on('data', event => {
			console.log(event);
			const publicKey = allKeysObject.getKey(event.returnValues.hotelAddress)['private'];
			const key = new nodeRSA(publicKey);
			const booking = new bookingModel({
				contractId : event.returnValues.contractId,
				customerEmail : key.decrypt(event.returnValues.customerEmail),
				hotelAddress : event.returnValues.hotelAddress,
				bookDate :  Date(event.returnValues.contractId),
				bookingStartDate : event.returnValues.startDate,
				bookingEndDate :  event.returnValues.endDate,
				amount : event.returnValues.amount,
				roomType : key.decrypt(event.returnValues.roomType),
				roomNeeded : key.decrypt(event.returnValues.roomNeeded),
				status : 'customer paid booking amount',
				emailSend : false,
				fullRefundDate : event.returnValues.refundDate
			})
			booking.save();
		})
	//TESTING NEEDED
	contract.events.hotelPaidTenPercentOfBookingAmount({fromBlock : process.env.BLOCK_NUMBER})
		.on('data', event => {
			console.log(event);
			//we can make a flag i booking DB, denoting that now user can submit the pin and conform the booking
			const contractId = event.returnValues.contractId;
			bookingModel.findOne({contractId})
				.then(async booking => {
					const publicKey = allKeysObject.getKey(booking.hotelAddress)['private'];
					const key = new nodeRSA(publicKey);
					booking.status = "Hotel confirmed the booking";
					booking.roomId = key.decrypt(event.returnValues.roomId);
					booking.sendEmail = false;
					await booking.save();

					const startDate= booking.bookingStartDate;
					const endDate = booking.bookingEndDate;
					const emailSend = booking.emailSend;
					const amount = booking.amount;
					const hotelAddress = booking.hotelAddress;
					const email = booking.customerEmail;
					const fullRefundDate = booking.fullRefundDate;
					const roomNeeded = booking.roomNeeded;
					if (emailSend == False){
						const text = `Dear Customer your booking is conformed and have contract ID = ${contractId}\n`+
						`with hotel with ethereum Address  =${hotelAddress}\n`+
						`You are alloted ${roomNeeded} rooms from ${startDate} to ${endDate}\n`+
						`You can cancel your booking till ...... \n`+
						`In case of cancelling booking by hotel you will get this amount ${amount}\n`+
						`You can recieve 95% refund on cancelling your booking till ${fullRefundDate}\n`+
						`After that you can recive 40% refund till the date of your booking start`;
						await sendEmail(email,text)
						booking.emailSend = true;
						booking.save();
					}
				})
				.catch(err => console.log(err))
			
		})

	//TESTING NEEDED
	contract.events.hotelCancelledBooking({fromBlock : process.env.BLOCK_NUMBER})
		.on('data', event => {
			console.log(event);
			
			const contractId = event.returnValues.contractId;
			bookingModel.findOne(contractId)
				.then(async booking => {
					booking.status = "cancelled by hotel";
					booking.sendEmail = false;
					await booking.save();
					const to = booking.customerEmail;
					const text = `Your booking with contractId ${contractId} is cancelled by hotel`+
					`Your account is credited with amount ${amount} as a compensation`+
					`Sorry for inconvience`;
					await sendEmail(to,text)
					booking.emailSend = true;
					booking.save();
					
				})
				.catch(err => console.log(Err));

		})

	//TESTING NEEDED
	contract.events.customerCancelledBooking({fromBlock : process.env.BLOCK_NUMBER})
		.on('data', event => {
			console.log(event);
			const contractId = event.returnValues.contractId;
			bookingModel.findOne(contractId)
				.then( async booking => {
					booking.status = "cancelled by customer";
					booking.sendEmail = false;
					booking.save();
					const to = booking.customerEmail;
					const text = `Your booking with contractId ${contractId} is cancelled by you`+
					`Your account is credited with your refund amount.\n`+
					`Sorry for inconvience`;
					await sendEmail(to,text);
					booking.emailSend = true;
					booking.save();
				})
				.catch(err => console.log(Err));

		})
}