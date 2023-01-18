import {WebSocketServer} from 'ws';
import {createServer} from 'http';
import {app} from './http-server.mjs';
import { messageReply } from './controllers/dataController.mjs';
import path from 'path'

// Create a server for the application for both http and ws
const server = createServer();

// Define the port
const PORT = process.env.PORT || 5000;

// Create new web socket server on top of http server
let wss = new WebSocketServer({server: server});

// Also mount the app here
server.on('request', app);

// Define __dirname
const rootDirectory = path.dirname('.');

wss.on('connection', function connectionReply(ws) {
    ws.on('message', (data) => {
      messageReply(data, wss, rootDirectory);
    })
});

server.listen(PORT, () => {
    return console.log(`http/ws server listening on ${PORT}`);
});

