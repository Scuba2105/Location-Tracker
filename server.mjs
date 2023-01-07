import express from 'express';
import path from 'path';
import {getJSON} from './controllers/dataController.mjs';

// Create app
const app = express();

// Define port
const PORT = process.env.PORT || 5000;

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

// Start server listening on port 5000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
