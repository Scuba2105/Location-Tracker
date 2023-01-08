import express from 'express';
import path from 'path';
import {getJSON} from './controllers/dataController.mjs';
import { WebSocketServer } from 'ws'
import http from 'http';

// Create app
const app = express();

// Define port
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Define __dirname
const rootDirectory = path.dirname('.')

// Serving static files 
app.use(express.static('public'));

// Serve index.html when root page accessed
app.get('/', (req, res) => {
  res.sendFile("public/html/index.html", { root: rootDirectory });
});

app.get('/capitals', async (req, res) => {
  try {
    getJSON(req, res, rootDirectory);
  } 
  catch (err) {
    res.send(err.message);
  }
});

const wss = new WebSocketServer({port: 5050});

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    if (data[0] == '{') {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
    }
    else {
      console.log(data.toString());
    }
  });
  ws.send('something from server');
});

// Start server listening on port 5000
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
