// System requires
var os = require('os');
var awsIot = require('aws-iot-device-sdk');

// Project requires
var config = require(__dirname + '/config.json');
var senseHat = require(__dirname + '/senseHatOverZeroRPC.js');

// Configure the Pi's ClientId to match the hostname
var THINGNAME = os.hostname();
config.clientId = THINGNAME;


console.log('Start of app for:', config.clientId);
console.log('Starting sense-hat zeroRPC server');
var sense = senseHat.start();

// console.log('Testing sense-hat zeroRPC server');
// sense.invoke('ping', function(err, response, more) {
//     if (err) {
//         console.error('ERROR', err);
//     } else {
//         console.log('Test success', response);
//     }
// });
// sense.invoke('get_accelerometer_raw', function(err, response, more) {
//     if (err) {
//         console.error('ERROR', err);
//     } else {
//         console.log('Test success', response);
//     }
// });

// IoT thingShadow Stuff
var thingShadow = awsIot.thingShadow(config);
var thingState = {};

function updateThingShadow() {
  thingShadow.update(THINGNAME, {
    state: {
      reported: thingState
    }
  });
}

function updateThingState(newState) {
  _.extend(thingState, newState);

  updateThingShadow();
}

thingShadow.on('connect', function() {
  console.log('thingShadow: connect');
  thingShadow.register(THINGNAME);

  setTimeout(sendStateToAWS, 1000);
});

thingShadow.on('close', function() {
  console.log('thingShadow: close');
  thingShadow.unregister(THINGNAME);
});

thingShadow.on('reconnect', function() {
  console.log('thingShadow: reconnect');
  thingShadow.register(THINGNAME);
});

thingShadow.on('offline', function() {
  console.log('thingShadow: offline');
});

thingShadow.on('error', function() {
  console.log('thingShadow: error');
});

thingShadow.on('message', function(topic, message) {
  console.log('thingShadow: message', topic, message);
});

thingShadow.on('status', function(thingName, stat, clientToken, stateObject) {
  // too much logging console.log('thingShadow: status', thingName, stat, clientToken, stateObject);
});

thingShadow.on('delta', function(thingName, stateObject) {
  console.log('thingShadow: delta: thingName:', thingName);
  console.log('thingShadow: delta: stateObject:', stateObject);

  if (stateOject.state) updateThingState(stateObject.state);
});

thingShadow.on('timeout', function(thingName, clientToken) {
  console.log('thingShadow: timeout', thingName, clientToken);
});

