# chat_board

## Usage 
### (node js required) [Download here.](https://nodejs.org/en/)

```bash
git clone https://github.com/Prashant047/chat_board.git
cd chat_board
npm install
```
edit the **`client.config.json`** file:
 (make sure that your user name is unique)

```json
{
    "name": "name", // your user name
    "host": "192.168.1.14", //server's ip address
    "port": "8081" // port 
}
```

edit the **`server.config.json`** file:
```json
{
    "port": "8081" // default port  /change it if you want
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