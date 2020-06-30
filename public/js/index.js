// const { default: Web3 } = require("web3");

// import Web3 from 'web3';
let web3;

window.addEventListener('load', async (event) => {
    console.log('loading');
    event.preventDefault();
    if(window.ethereum){//for latest version of metamask
        console.log('yes');
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    }
    else if(window.web3){//for old version of metamask and other wallets
        web3 = new Web3(window.web3.currentProvider); //provider is any module whichenables us to connct to ethereum network
        //like metamask, other wallets
        //no need to enable it 
    }
    else{
        console.log('install metamask');
    }
})

web3.eth.sendTransaction({to : '0x1142510Eab39FE0BD8B033A80B2e34431C38DD64', value :  web3.utils.toHex(web3.utils.toWei('0.001','ether'))})
    .then(res => console.log(res))
    .catch(err => console.log(err));