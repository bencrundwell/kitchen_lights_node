#!/usr/bin/env node

// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client = new OPC('localhost', 7890);

var num_leds = 158;


var red = Math.random()*127 + 127;
var green = Math.random()*127 + 127;
var blue = Math.random()*127 + 127;

module.exports = function(RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);
}

// function draw() {
//     var millis = new Date().getTime();


//     for (var pixel = 0; pixel < num_leds; pixel++)
//     {
//         client.setPixel(pixel, red, green, blue);
//     }
//     client.writePixels();
// }

// function close() {
//     client.close();
// }

// draw();
// setTimeout(draw, 30);
// setTimeout(draw, 60);
// setTimeout(close, 90);
