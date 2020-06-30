const { SMTPClient } = require('emailjs')

const client = new SMTPClient({
    user: 'ethereumblockchain01',
    password: '',
    host: 'smtp.gmail.com',
    ssl: true,
});
// send the message and get a callback with an error or details of the message that was sent
client.send(
	{
        text: 'i hope this works',
        from : 'Ethereum ethereumblockchain@gmail.com',
        to: 'Vipin vipinyadav1041998@gmail.com',
        subject: 'Testing emailjs',
  },
    (err,msg) => {
        console.log(err);
        console.log(msg);
  }
);
