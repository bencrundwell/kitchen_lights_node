#!/usr/bin/env node

// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client;
var node;

const { debug } = require('console');
const util = require('util')

client = new OPC('localhost', 7890);

var num_leds = 158;

var red = 255;
var green = 191;
var blue = 126;
var brightness = 255;
var state = true;

function draw() {          
    var temp_red = state ? red * brightness / 255 : 0;
    var temp_green = state ? green * brightness / 255 : 0;
    var temp_blue = state ? blue * brightness / 255 : 0;
    console.log("Send  R=" + temp_red + " G=" + temp_green + " B=" + temp_blue + " via OPC");
    for (var pixel = 0; pixel < num_leds; pixel++)
    {
        client.setPixel(pixel, temp_red, temp_green, temp_blue);
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
            //console.log("msg = " + util.inspect(msg, false, null, true /* enable colors */));
            console.log("msg.payload = " + util.inspect(msg.payload, false, null, true /* enable colors */));
            
            const mqtt_message = JSON.parse(msg.payload);

            // Home Automation MQTT commands
            if (mqtt_message.state) {
                if (mqtt_message.state == "ON")
                {
                    console.log("MQTT: ON")
                    state = true;
                    if (mqtt_message.color) {
                        red = mqtt_message.color.r;
                        green = mqtt_message.color.g;
                        blue = mqtt_message.color.b;
                    }
                    else if (mqtt_message.color_temp) {
                        console.log("SetColorTemperatureRequest:")
                        var kelvin = 1000000 / mqtt_message.color_temp;
                        if (kelvin <= 1850)
                        {
                            red = 255;
                            green = 129;
                            blue = 0;
                        }
                        else if (kelvin <= 2550)
                        {
                            red = 255;
                            green = 162;
                            blue = 74;
                        }
                        else if (kelvin <= 3350)
                        {
                            red = 255;
                            green = 191;
                            blue = 126;
                        }
                        else if (kelvin <= 5000)
                        {
                            red = 255;
                            green = 228;
                            blue = 204;
                        }
                        else if (kelvin <= 6200)
                        {
                            red = 255;
                            green = 249;
                            blue = 255;
                        }
                        else if (kelvin <= 9500)
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
                    else if (mqtt_message.brightness) { 
                        brightness = mqtt_message.brightness;
                    }
                }
                else if (mqtt_message.state == "OFF")
                {
                    console.log("MQTT: OFF")
                    state = false;
                }
            }

            // Alexa integration commands
            else if (msg.command == "SetColorRequest")
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

