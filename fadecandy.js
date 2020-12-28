#!/usr/bin/env node

// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client;
var node;

const util = require('util')

client = new OPC('localhost', 7890);

var num_leds = 158;


var red = 0;
var green = 0;
var blue = 0;

function draw() {
    for (var pixel = 0; pixel < num_leds; pixel++)
    {
        client.setPixel(pixel, red, green, blue);
    }
    client.writePixels();
}

function close() {
    client.close();
}

function finished() {
}

module.exports = function(RED) {
    function Fadecandy(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            //msg.payload = msg.payload;

            red = 0;
            green = 0;
            blue = 0;

            console.log("msg = " + util.inspect(msg, false, null, true /* enable colors */));

            console.log("msg.payload = " + util.inspect(msg.payload, false, null, true /* enable colors */));
            
            if (msg.command == "SetColorRequest")
            {
                console.log("SetColorRequest:")
                var hsv_conversion = OPC.hsv(msg.payload.hue/360, msg.payload.saturation, msg.payload.brightness)

                console.log("HSV>RGB = " + hsv_conversion);

                red = hsv_conversion[0];
                green = hsv_conversion[1];
                blue = hsv_conversion[2];
            }

            else if (msg.command == "SetColorTemperatureRequest")
            {
                console.log("SetColorTemperatureRequest:")
                if (msg.payload <= 1850)
                {
                    red = 255;
                    green = 129;
                    blue = 0;
                }
                else if (msg.payload <= 2550)
                {
                    red = 255;
                    green = 162;
                    blue = 74;
                }
                else if (msg.payload <= 3350)
                {
                    red = 255;
                    green = 191;
                    blue = 126;
                }
                else if (msg.payload <= 5000)
                {
                    red = 255;
                    green = 228;
                    blue = 204;
                }
                else if (msg.payload <= 6200)
                {
                    red = 255;
                    green = 249;
                    blue = 255;
                }
                else if (msg.payload <= 9500)
                {
                    red = 223;
                    green = 231;
                    blue = 255;
                }
                else
                {
                    red = 161;
                    green = 191;
                    blue = 255;
                }

            }

            else if (msg.command == "SetPercentageRequest")
            {
                red   = (255 * msg.payload) / 100;
                green = (191 * msg.payload) / 100;
                blue  = (126 * msg.payload) / 100;
            }

            else if (msg.command == "TurnOnRequest")
            {
                console.log("TurnOnRequest:")
                red = 255;
                green = 191;
                blue = 126;
            }
            draw();
            setTimeout(draw, 30);
            setTimeout(draw, 60);
            //setTimeout(finished, 90);

            msg.payload = true;
            node.send(msg);
        });
        
    }
    RED.nodes.registerType("fadecandy",Fadecandy);
}

