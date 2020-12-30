Simple Node-Red node to interface to a fadecandy server.

Install by heading to the node-red install directory:
    cd ~/.node-red
    npm install ~/kitchen_lights_node

This creates a symlink to the working folder.

Node-red needs to be restarted each time you make a change to the module. VSCode is then set up to run node-red and you can then debug the js files directly. (Note, the symlink doesn't work in VSC for some reason, so open the local copy in /home/pi/.node-red/node_modules/node-red-contrib-fadecandy/fadecandy.js) 

Status:
MQTT integration working.

TODO:
* Add an output JSON string and pipe into a MQTT response, to sync the status between HASS and Node-Red properly
* Add animations and special modes e.g. gradients, animated switch-on, party mode etc