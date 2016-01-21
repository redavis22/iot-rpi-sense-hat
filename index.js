// System requires
var os = require('os');
var awsIot = require('aws-iot-device-sdk');
var _ = require('lodash');

// Project requires
var config = require(__dirname + '/config.json');
var senseHat = require(__dirname + '/senseHatOverZeroRPC.js');

// Configure the Pi's ClientId to match the hostname
var THINGNAME = os.hostname();
config.clientId = THINGNAME;

console.log('Start of app for:', config.clientId);
console.log('Starting sense-hat zeroRPC server');
var sense = senseHat.start();


// SENSORS
var sensors = {};

function getAndPublishSensorData() {

    var temp = {};
    temp.thingState = _.clone(thingState);
    temp.device = THINGNAME;

    sense.invoke('get_accelerometer_raw', function(error, res, done) {
        if (error) console.error(error);
        else {
            temp.raw_accelerometer = res;
            temp.raw_accelerometer_magnitude = Math.abs(res.x) + Math.abs(res.y) + Math.abs(res.z);

            sense.invoke('get_orientation_radians', function(error, res, done) {

                if (error) console.error(error);
                else {
                    temp.orientation_radians = res;

                    thingShadow.publish(THINGNAME + '/sensors', JSON.stringify(temp), {}, function() {
                        // console.log('Publish:', THINGNAME + '/sensors', temp);
                        setTimeout(getAndPublishSensorData, 0);
                    });
                }

            });
        }
    });
}
setTimeout(getAndPublishSensorData, 2000);




// IOT THINGSHADOW MANAGEMENT
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

    console.log('updated thingState to:', thingState);

    setTimeout(updateThingShadow, 0);
}

thingShadow.on('connect', function() {
    console.log('thingShadow: connect');
    thingShadow.register(THINGNAME, {
        persistentSubscribe: true
    });

    setTimeout(updateThingShadow, 1000);
});

thingShadow.on('close', function() {
    console.log('thingShadow: close');
    thingShadow.unregister(THINGNAME);
});

thingShadow.on('reconnect', function() {
    console.log('thingShadow: reconnect');
    thingShadow.register(THINGNAME, {
        persistentSubscribe: true
    });
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

    if (stateObject.state) updateThingState(stateObject.state);
});

thingShadow.on('timeout', function(thingName, clientToken) {
    console.log('thingShadow: timeout', thingName, clientToken);
});
