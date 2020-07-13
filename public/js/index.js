const socket = io('/');
// const socket = io({transports: ['websocket'], upgrade: false});

socket.on('connect', () => {
    // console.log(window.location.href);
    // console.log(socket.id); // 'G5p5...'
  });

socket.on('disconnect', () => {
    // console.log('disconnect '+ socket.id);
    socket.removeAllListeners();
 });

socket.on('sendMetamaskTransaction',(o) => {
  const {paymentAddress, amountEth, funcAbi} = o;
  console.log('send Metamask transasction called');
  console.log(paymentAddress);
  console.log(amountEth);
  console.log(funcAbi);
  web3.eth.sendTransaction({
    to: paymentAddress,
    value: web3.toWei(amountEth, 'ether'),
    data : funcAbi,
    gasLimit : web3.toHex(2100000),
    gasPrice : web3.toHex(web3.toWei('10','gwei'))
  }, (err, transactionId) => {
    if  (err) {
      console.log('Payment failed', err)
    } else {
      console.log('Payment successful', transactionId)
    }
  })
});

window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      // initPayButton()
    } catch (err) {
      $('#status').html('User denied account access', err)
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider)
  //   initPayButton()
  } else {
      console.log('Install Metamask');
  }
})


const bookForm = document.getElementById("book-room");

bookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const roomType = event.target.elements.roomType.value;
  const email = event.target.elements.email.value;
  const startDate = event.target.elements.startDate.value;
  const endDate = event.target.elements.endDate.value;
  // console.log(event.target.elements.roomType.value);
  const o ={
    roomType,
    email,
    startDate,
    endDate
  }
  // console.log(o)
  socket.emit('book-room',o);
})