import {WebSocketServer} from 'ws';
import {createServer} from 'http';
import {app} from './http-server.mjs';
import { getJsonLocationData, writeJsonLocationData } from './controllers/dataController.mjs';
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
    ws.on('message', function messageReply(data) {
      const text = data.toString();
      if (text[0] == '{' || text[0] == '[') {
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            const dataObject = JSON.parse(text);
            client.send(JSON.stringify(dataObject));
          }
        });
        // Read the old JSON data and insert the new data
        const newData = JSON.parse(text);
        let locationData = JSON.parse(getJsonLocationData(rootDirectory));
        console.log(locationData);
        const newEntry = {"Current Continent": newData["New Continent"], "Current Country": newData["New Country"], "Current Location": newData["New Location"], "No. of Times Travelled": newData["Travel Count"]};
        const entryIndex = newData["index"];
        locationData[entryIndex] = newEntry;
        const fileContent = JSON.stringify(locationData, null, 2); 
        writeJsonLocationData(fileContent, rootDirectory);
      }
      else {
        return console.log(text);
       }
    });
    console.log('Successfully connected');
  });

server.listen(PORT, () => {
    return console.log(`http/ws server listening on ${PORT}`);
  });

