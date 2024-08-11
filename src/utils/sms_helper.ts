const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

client.verify.v2.services("")
    .verifications
    .create({ to: '', channel: 'sms' })
    .then((verification: any) => console.log(verification.sid));