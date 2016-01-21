var zerorpc = require("zerorpc");
var spawn = require('child_process').spawn;

var sensorsZeroRPC;
var zeroRPCClient;

module.exports = {

    start: function() {

        sensorsZeroRPC = spawn('python', ['senseHatOverZeroRPC.py']);
        sensorsZeroRPC.on('error', function(err) {
            console.error('ERROR', err);
        });

        zeroRPCClient = new zerorpc.Client();

        zeroRPCClient.connect('tcp://127.0.0.1:4242');

        zeroRPCClient.on("error", function(error) {
            console.error("RPC client error:", error);
        });

        return zeroRPCClient.invoke; // invoke(method, arguments..., callback)
        // callback(error, response, more)
    }

};
