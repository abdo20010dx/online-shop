
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

exports.nodemailer=(email,subj,mess)=>{

    let transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: 'express.gomla@gmail.com',
        pass: 'gomla20010'
      },

    }));
     

      let mailOptions = {
        from: 'express.gomla@gmail.com',
        to: email,
        subject:subj ,
        text: mess
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('email doesnt sent'+error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
}