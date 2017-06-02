# chat_board
### Terminal chat for local network
## Usage 
### (node js required) [Download here.](https://nodejs.org/en/)

```bash
git clone https://github.com/Prashant047/chat_board.git
cd chat_board
npm install
```
edit the **`client.config.json`** file with server's ip_address and port, and your user name:
 (make sure that your user name is unique)

```json
{
    "name": "name", 
    "host": "192.168.1.14",
    "port": "8081" 
}
```

edit the **`server.config.json`** file. Default port is 8081 change it if you want:
```json
{
    "port": "8081" 
}
```

To start the server:
```bash
node built/main.js
```

To connect to server as a client:
```bash
node built/client.js
```