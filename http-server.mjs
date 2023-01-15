import express from 'express';
import path from 'path';
import { getJsonCountries, getJsonLocationData } from './controllers/dataController.mjs';


// Create app
export const app = express();

// Define __dirname
const rootDirectory = path.dirname('.');

// Serving static files 
app.use(express.static('public'));

// Serve index.html when root page accessed
app.get('/', (req, res) => {
  try {
    const locationData = getJsonLocationData(rootDirectory);
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





