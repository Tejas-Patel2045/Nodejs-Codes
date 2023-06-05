const nodemailer = require("nodemailer");
// var testAccount = {
//     user: 'vmokshalabtest@gmail.com',
//     pass: 'meg@Mark95'
// }
var testAccount = {
    user: 'helenzystech@gmail.com',
    pass: 'dapirjddunxuppnb'   
}
//Create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // port: 25,
    port: 587,
    // port: 465,
    // secure: true,
    secure: false, // true for 465, false for other ports
    auth: {
        user: testAccount.user, // generated gmail user
        pass: testAccount.pass // generated gmail password
    },
    // requireTLS: true,
    ignoreTLS: false,
    tls: { rejectUnauthorized: false },
    // tls: { ciphers: 'SSLv3' }
});

let urls = {
    // websiteUrl: "http://172.16.10.11:3000",  //Production
    // websiteUrl: "http://3.216.208.149",   //Development
    // websiteUrlForPublic : "http://3.216.208.149/"   //Production Url for public access(only for candidates)

    websiteUrl: "http://3.216.208.149",
    websiteUrlForPublic : "http://3.216.208.149"


}

module.exports = {
    transporter: transporter,
    testAccount: testAccount,
    urls : urls
};
