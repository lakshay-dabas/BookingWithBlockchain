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


 socket.on('cancel-booking',(o) => {
    const {paymentAddress, funcAbi} = o;
    console.log('send Metamask transasction called for booking cancellation');
    web3.eth.sendTransaction({
      to: paymentAddress,
      data : funcAbi,
      gasLimit : web3.toHex(2100000),
      gasPrice : web3.toHex(web3.toWei('10','gwei'))
    }, (err, transactionId) => {
      if  (err) {
        console.log('transaction failed', err)
      } else {
        console.log('transaction successful', transactionId)
      }
    })
  });

  
  socket.on('alert',o => {
      const msg = o.msg;
      alert(msg);
      // window.location.href = "index";
  })

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
  

const cancelBooking = document.getElementById("cancel-booking");

cancelBooking.addEventListener('submit', event => {
    event.preventDefault();
    // console.log(event.target.elements);
    socket.emit('cancel-booking',{contractId : event.target.elements.contractId.value})
})