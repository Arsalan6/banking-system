const domain = 'https://api.mailgun.net/v4/domains';
const mailgun = require('mailgun-js')
  ({ apiKey: process.env.MAILGUN_API_KEY, domain: domain });

const sendResetPasswordMail = (receiver_email, userUuid) => {

  const data = {
    "from": 'banking_system_assignment@gmail.com',
    "to": receiver_email,
    host: "api.eu.mailgun.net",
    "subject": 'Reset password for banking system',
    "text": `
    Use this link to reset your password
    http://localhost:3000/reset-password?userId=${userUuid}
  `
  };

  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(body);
        resolve(body);
      };
    });
  })
}

module.exports = { sendResetPasswordMail };
