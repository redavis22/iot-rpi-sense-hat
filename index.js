// System requires
var os = require('os');

// Project requires
var config = require(__dirname + '/config.json');
var senseHat = require(__dirname + '/senseHatOverZeroRPC.js');

// Configure the Pi's ClientId to match the hostname
config.clientId = os.hostname();

console.log('Start of app for:', config.clientId);
console.log('Starting sense-hat zeroRPC server');
var sense = senseHat.start();

console.log('Testing sense-hat zeroRPC server');
sense.invoke('ping', function(err, response, more) {
    if (err) {
        console.error('ERROR', err);
    } else {
        console.log('Test success', response);
    }
});

sense.invoke('get_accelerometer_raw', function(err, response, more) {
    if (err) {
        console.error('ERROR', err);
    } else {
        console.log('Test success', response);
    }
});
