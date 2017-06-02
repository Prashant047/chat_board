//Importing all the modules======================
import io from 'socket.io-client';
import readline from 'readline';
import colors from 'colors';
import fs from 'fs';
//-----------------------------------------------

let config_;

try{
    config_ = fs.readFileSync(__dirname + '/../client.config.json');
}
catch(err){
    // console.log(err);
    console.log('client.config.json file not found'.red);
    process.exit(0);
}

let client_config = JSON.parse(config_.toString());

const HOST = client_config.host;
const PORT = client_config.port;
const rl   = readline.createInterface(process.stdin, process.stdout);
const ME   = client_config.name;

// let clients = [];

const socket = io.connect(`http://${HOST}:${PORT.toString()}`);
console.log('Waiting for connection...');
//-----------------------------------------------

//when connection to server has been established this runs
socket.on('yo_are_connected',(data) => {
    console.log('Connected to the server at ' + HOST + ' and port ' + PORT + ' -->');
    console.log('\n');
    console.log('\t'+'+----------------------------------------+'.red);
    console.log('\t'+'|'.red+'\t' + ' WELCOME TO THE CHAT BOARD'.rainbow+ ' \t '+ '|'.red);
    console.log('\t'+'+----------------------------------------+'.red);
    console.log('To send a message:'.bold.green + ' chat_name>your_message'.cyan);
    console.log('type \'list\' (without quotes) to see people avaliable for chat'.cyan);
    socket.emit('add_to_list',{
        name: ME
    });

    socket.emit('show_list',{
        nothing: ''
    });
});

//-----------------------------------------------


//message to the comman board====================
socket.on('board',(data) => {
    console.log('| '.bold.red +  data.message_from.toString().bold.red + ' --> '.bold.red + 'board'.magenta + ' | '.bold.red + ' -- '.blue + data.message.green  );
});
//-----------------------------------------------


//when a message is recived======================
socket.on(ME,(data) => {
    console.log('| '.bold.red + data.message_from.toString().bold.red + ' |'.bold.red + ' -- '.blue + data.message.green );
});
//=----------------------------------------------


//display the list of all connected clients======
socket.on('take_list',(data) => {
    console.log('These are the people avalible for chat'.underline.blue);
    for(let y=0;y<data.clients.length;y++){
        if(data.clients[y].name.indexOf('-disconnected') != -1){
            continue;
        }
        else if(data.clients[y].name == ME){
            console.log('\t'+data.clients[y].name.magenta+'  <- ME'.bold.magenta);
        }
        else{
            console.log('\t'+data.clients[y].name.magenta);
        }
    }
    console.log('\tboard - common chat for everyone'.bold.magenta);
    
});
//-----------------------------------------------


// Taking input form console=====================
rl.setPrompt('');

rl.prompt();
rl.on('line', (line) => {
    
    if(line === 'list'){
        socket.emit('show_list',{
            nothing: ''
        });
    }
    else
    {
        let tag = line.indexOf('>');
        let send_to = line.slice(0,tag).replace(/ /g,'');
        let message = line.slice(tag+1);

        
        socket.emit('send_message',{
            message_to: send_to,
            message: message,
            message_from: ME
        });
    }
    rl.prompt();

}).on('close',()=>{
    process.exit(0);
});
//-----------------------------------------------


