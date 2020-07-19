const { SMTPClient } = require('emailjs')
require('dotenv').config();
const client = new SMTPClient({
    user: 'ethereumblockchain01',
    password: `${process.env.EMAIL_PASSWORD}`,
    host: 'smtp.gmail.com',
    ssl: true,
});
// send the message and get a callback with an error or details of the message that was sent
function sendEmail(to, text){
  client.send(
    {
          text,
          from : 'Ethereum ethereumblockchain@gmail.com',
          to: `Vipin ${to}`,
          subject: 'Booking With Blockchain BWB',
    },
      (err,msg) => {
          console.log(err);
          console.log(msg);
    }
  );
}

// sendEmail('vipinyadav1041998@gmail.com','HELLO VIPIN');
module.exports = {
  sendEmail
}