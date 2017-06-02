'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//-----------------------------------------------

//importing modules==============================
var config_ = void 0;
try {
    config_ = _fs2.default.readFileSync(__dirname + '/../server.config.json');
} catch (err) {
    console.log('server.config.json file not found');
    process.exit(0);
}
var server_config = JSON.parse(config_.toString());

var app = (0, _express2.default)();
var server = _http2.default.Server(app);
var socket = (0, _socket2.default)(server);

var PORT = server_config.port;

//Starting the server============================
server.listen(PORT, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server running on port ' + PORT);
    }
});
//-----------------------------------------------

var no_of_clients = 0;
var clients = [];

// when socket accepts connection=================
socket.on('connection', function (client) {
    no_of_clients++;
    // console.log(`client ${client.id} has connected`);
    client.emit('yo_are_connected', {
        man: "yes you are!!!"
    });

    //add the connected client to the list======================
    client.on('add_to_list', function (data) {
        var temp = {
            id: client.id.toString(),
            name: data.name
        };

        clients.push(temp);
        console.log(data.name + ' has connected.');
    });
    //----------------------------------------------------------


    //shows the list of connected clients on client side========
    client.on('show_list', function (data) {
        client.emit('take_list', {
            clients: clients
        });
    });
    //----------------------------------------------------------


    //send message from one client to other=====================
    //handeler for sending messages
    client.on('send_message', function (data) {

        // console.log(data);

        client.broadcast.emit(data.message_to.toString(), {
            message_from: data.message_from,
            message: data.message
        });
    });
    //----------------------------------------------------------

    client.on('disconnect', function () {
        no_of_clients--;
        // console.log(`${getClientNameFromId(clients,client.id.toString())} disconnected.`)

        // for(let i = 0;i<clients.length;i++){
        //     if(clients[i].id == client.id.toString()){
        //         console.log(clients[i].name);
        //     }
        // }

        clients.forEach(function (item, index) {
            if (item.id == client.id.toString()) {
                console.log(item.name + ' has disconnected');
                item.name = item.name + ' -disconnected';
                item.id = '';
            }
        });
    });
});