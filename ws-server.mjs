import {WebSocketServer} from 'ws';
import {createServer} from 'http';
import {app} from './http-server.mjs';

const server = createServer();

// Define the port
const PORT = process.env.PORT || 5000;

// Create new web socket server on top of http server
let wss = new WebSocketServer({server: server});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      const text = data.toString();
      if (text[0] == '{') {
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            const dataObject = JSON.parse(text);
            console.log(dataObject);
            client.send(JSON.stringify(dataObject));
          }
        });
      }
      else {
        return console.log(data.toString());
      }
    });
    console.log('Successfully connected');
  });

server.listen(PORT, () => {
    return console.log(`http/ws server listening on ${PORT}`);
  });

