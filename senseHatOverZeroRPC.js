var zerorpc = require("zerorpc");
var spawn = require('child_process').spawn;

module.exports = {

    serverStart: function() {
        var sensorsZeroRPC = spawn('python', ['sensorsZeroRPC.py']);
        sensorsZeroRPC.on('error', function(err) {
            console.error('ERROR', err);
        });
    },
    clientStart: function() {
        var zeroRPCClient = new zerorpc.Client();

        zeroRPCClient.connect('tcp://127.0.0.1:4242');

        zeroRPCClient.on("error", function(error) {
            console.error("RPC client error:", error);
        });
    }

};
