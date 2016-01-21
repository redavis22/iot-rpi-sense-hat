// System requires
var os = require('os');

// Project requires
var config = require(__dirname + '/config.json');

// Configure the Pi's ClientId to match the hostname
config.clientId = os.hostname();

console.log('Start of app for:', config.clientId);



