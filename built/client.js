'use strict';

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//-----------------------------------------------

//Importing all the modules======================
var config_ = void 0;

try {
    config_ = _fs2.default.readFileSync('../client.config.json');
} catch (err) {
    console.log('client.config.json file not found'.red);
    process.exit(0);
}

var client_config = JSON.parse(config_.toString());

var HOST = client_config.host;
var PORT = client_config.port;
var rl = _readline2.default.createInterface(process.stdin, process.stdout);
var ME = client_config.name;

// let clients = [];

var socket = _socket2.default.connect('http://' + HOST + ':' + PORT.toString());
console.log('Waiting for connection...');
//-----------------------------------------------

//when connection to server has been established this runs
socket.on('yo_are_connected', function (data) {
    console.log('Connected to the server at ' + HOST + ' and port ' + PORT + ' -->');
    console.log('\n');
    console.log('\t' + '+----------------------------------------+'.red);
    console.log('\t' + '|'.red + '\t' + ' WELCOME TO THE CHAT BOARD'.rainbow + ' \t ' + '|'.red);
    console.log('\t' + '+----------------------------------------+'.red);
    console.log('To send a message:'.bold.green + ' chat_name>your_message'.cyan);
    console.log('type \'list\' (without quotes) to see people avaliable for chat'.cyan);
    socket.emit('add_to_list', {
        name: ME
    });

    socket.emit('show_list', {
        nothing: ''
    });
});

//-----------------------------------------------


//message to the comman board====================
socket.on('board', function (data) {
    console.log('| '.bold.red + data.message_from.toString().bold.red + ' --> '.bold.red + 'board'.magenta + ' | '.bold.red + ' -- '.blue + data.message.green);
});
//-----------------------------------------------


//when a message is recived======================
socket.on(ME, function (data) {
    console.log('| '.bold.red + data.message_from.toString().bold.red + ' |'.bold.red + ' -- '.blue + data.message.green);
});
//=----------------------------------------------


//display the list of all connected clients======
socket.on('take_list', function (data) {
    console.log('These are the people avalible for chat'.underline.blue);
    for (var y = 0; y < data.clients.length; y++) {
        if (data.clients[y].name.indexOf('-disconnected') != -1) {
            continue;
        } else if (data.clients[y].name == ME) {
            console.log('\t' + data.clients[y].name.magenta + '  <- ME'.bold.magenta);
        } else {
            console.log('\t' + data.clients[y].name.magenta);
        }
    }
    console.log('\tboard - common chat for everyone'.bold.magenta);
});
//-----------------------------------------------


// Taking input form console=====================
rl.setPrompt('');

rl.prompt();
rl.on('line', function (line) {

    if (line === 'list') {
        socket.emit('show_list', {
            nothing: ''
        });
    } else {
        var tag = line.indexOf('>');
        var send_to = line.slice(0, tag).replace(/ /g, '');
        var message = line.slice(tag + 1);

        socket.emit('send_message', {
            message_to: send_to,
            message: message,
            message_from: ME
        });
    }
    rl.prompt();
}).on('close', function () {
    process.exit(0);
});
//-----------------------------------------------