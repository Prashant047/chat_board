//importing modules==============================
import express from 'express';
import http from 'http';
import io from 'socket.io';
import fs from 'fs';
//-----------------------------------------------

let config_;
try{
    config_ = fs.readFileSync(__dirname + '/../server.config.json');
}catch(err){
    console.log('server.config.json file not found');
    process.exit(0);
}
let server_config = JSON.parse(config_.toString());

const app = express();
const server = http.Server(app);
const socket = io(server);

const PORT = server_config.port;

//Starting the server============================
server.listen(PORT,(error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log(`Server running on port ${PORT}`);
    }
});
//-----------------------------------------------

let no_of_clients = 0;
let clients = [];


// when socket accepts connection=================
socket.on('connection', (client) =>{
    no_of_clients++;
    // console.log(`client ${client.id} has connected`);
    client.emit('yo_are_connected',{
        man: "yes you are!!!"
    });

    //add the connected client to the list======================
    client.on('add_to_list',(data) =>{
        let temp = {
            id: client.id.toString(),
            name: data.name
        };
        
        clients.push(temp);
        console.log(`${data.name} has connected.`);
    });
    //----------------------------------------------------------


    //shows the list of connected clients on client side========
    client.on('show_list',(data) => {
        client.emit('take_list',{
            clients: clients
        });
    });
    //----------------------------------------------------------


    //send message from one client to other=====================
    //handeler for sending messages
    client.on('send_message',(data) => {

        // console.log(data);

        client.broadcast.emit(data.message_to.toString(),{
            message_from: data.message_from,
            message: data.message
        });
    });
    //----------------------------------------------------------

    client.on('disconnect',() => {
        no_of_clients--;
        // console.log(`${getClientNameFromId(clients,client.id.toString())} disconnected.`)
        
        // for(let i = 0;i<clients.length;i++){
        //     if(clients[i].id == client.id.toString()){
        //         console.log(clients[i].name);
        //     }
        // }

        clients.forEach((item, index) => {
            if(item.id == client.id.toString()){
                console.log(`${item.name} has disconnected`);
                item.name = item.name + ' -disconnected';
                item.id = '';
            }
        });
        
    });
});

