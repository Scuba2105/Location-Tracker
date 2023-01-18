import express from 'express';
import path from 'path';
import { getJsonCountries } from './controllers/dataController.mjs';
import { readJSONLocationData } from './model/models.mjs';

// Create app
export const app = express();

// Define __dirname
const rootDirectory = path.dirname('.');

// Serving static files 
app.use(express.static('public'));

// Serve index.html when root page accessed
app.get('/', (req, res) => {
  try {
    //const locationData = readJSONLocationData(rootDirectory);
    res.sendFile("public/html/index.html", { root: rootDirectory });
  } catch (error) {
    
  } 
});

app.get('/capitals', async (req, res) => {
  try {
    getJsonCountries(req, res, rootDirectory);
  } 
  catch (err) {
    res.send(err.message);
  }
});





