pragma solidity ^0.5.1;

contract hotel{
    //request for room booking
        //this will happen at cleint side
    
    //if we can fufill it (see if room are empty for those days)
        //hotel db will be checked for that and notificaition of room availability will be send to cutomer
    
    //take booking amount(full payment) in smart contract address, 10% of the booking amount from hotel
        //here smart contract plays role
        //recieve money from customer and hotel
        //QUESTION:
            //who will pay first -> i think customer, bcz hotel may not have money to first pay
                //doenst matter we will open some 12hr 
    
    
    //if room cancel is done, repay the amount by deducting small amount say 5% and pay that 5% to hotel
    
    //if booking is cancelled by hotel, repay the full amount to customer
    
    //if room is properly checked by the customer and and he/she decide to stay,says ok then pay the full amount to hotel
    
}

//IMPLEMENTATION
// mapping of cutomer->booking dates, amount submitted by customer and hotel
//func -> bookRoomByCustomer(customerId,amount){
    // asign this contract a random id
    //accept the payment  from customer
    // send notificaition to hotel with param-> id,amount customer payed
// }
//func -> verify room -> input true or false,  pay amount, 




//THINGS TO BE TAKEN CARE
//if customer pay the amount but hotel doesnt conforms the booking in like 24 hr(doesnt pay 10% of booking amount)
//smart contract is immutable so static data should not be stores, like number of rooms, theri types, 
//sc should only deal with money matters i guess
//checking if room is empty or not should be done by hotel.
//if hotel falsify that room is free then when customer arrives at the hotel to have that room, untill he/she verify it we will not give money to hotel
//hotel have to pay its payment fast to complete the contract,bcz customers not like to wait for that long to complete booking
//if hotel pays first, then customer may cancel transaction but gas fee of hotel will be deducted
//customer can do this again and again, and make it a financial attack on hotel
//so it is required that customer pays first, if customer pays cancels then hotel will get the fine which will compensate more than the gas fee and efforts they put
//but hotel needs to pay to smart contract as fast as possible to confirm booking,
//SOLTION TO THIS PROBLEM:
    //so time window
        //how much time?
    //hotel will have its staff and its own technology so we can except them to pay fast or reject request withink like 5min(blockchain transaction takes some seconds to complete like 
    // may be a minute in worst case scenario and hotel also needs time to check availability of room in db and confirm it)(whole this process will take normally 20-25seconds)


//Race conditions may happend

//1 resuest came -> i confirmed it and start the payment to smart contract, till payment is not complete i cant say room is booked
//2 resquest came -> i again say room empty but while its payment, it already booked by request 1

//TO OVERCOME THIS:
    //if a request came and room is empty then make is occupied, if payment is not successful then make it empty again
    //now if 2nd request came then room will be seen as occupied.
    
//A customer may book more rooms then one so how can we uniquely identify a contract-> (hotel,cutomer,room)
//easy way asign a random id to the contract and return it to the hotel and request for its payment

//PROBLEM SOLVED IN REAL LIFE

//hotel if try to do anything unethical till room allocation and verification by the customer, customer money will be safe
// and hotel will also not try to do unethical pricatices, in fear of loosing 10% of the money they  have given to the smart contract...


//FUTURE VERSION:
    //multiple hotel booking
    //customer expierence enanchment(notification if price of that hotel, he/she searched in someday back)