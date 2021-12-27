var main = async function (details) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'XXXXXX@gmail.com', // generated  user
            pass: 'XXXXX', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Todo@doodle.com', // sender address
        to: details.email, // list of receivers
        subject: "User OTP verification", // Subject line
        text: "Hello world?", // plain text body
        html: "your otp verfication no:" + details.otp, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

