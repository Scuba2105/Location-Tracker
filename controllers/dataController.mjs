import fs from 'fs'
import path from 'path';
import { readJSONLocationData, insertNewLocationData } from '../model/models.mjs'

export async function getJsonCountries(req, res, rootPath) {
    const dataPath = path.join(rootPath, 'data', 'capitals.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(data);
  });
}

export function messageReply(data, wss, rootDirectory) {
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
      let locationData = JSON.parse(readJSONLocationData(rootDirectory));
      insertNewLocationData(newData, locationData, rootDirectory);
    }
    else {
      return console.log(text);
    }
}


    


