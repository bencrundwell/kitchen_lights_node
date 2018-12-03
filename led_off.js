#!/usr/bin/env node

// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client = new OPC('localhost', 7890);

function draw() {
    var millis = new Date().getTime();

    for (var pixel = 0; pixel < 512; pixel++)
    {
        var red = 0;
        var green = 0;
        var blue = 0;
        
        var red = 0;
        var green = 0;
        var blue = 255;

        client.setPixel(pixel, red, green, blue);
    }
    client.writePixels();
}

// draw();
setTimeout(draw, 100);
setTimeout(draw, 200);
setTimeout(draw, 300);
setTimeout(draw, 400);

