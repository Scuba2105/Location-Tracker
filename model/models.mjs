import path from 'path';
import fs from 'fs';

export function insertNewLocationData(newData, locationData, rootDirectory) {
    const newEntry = {"Current Continent": newData["New Continent"], "Current Country": newData["New Country"], "Current Location": newData["New Location"], "No. of Times Travelled": newData["Travel Count"]};
      const entryIndex = newData["index"];
      locationData[entryIndex] = newEntry;
      const fileContent = JSON.stringify(locationData, null, 2); 
      writeJsonLocationData(fileContent, rootDirectory);
};

export function readJSONLocationData(rootPath) {
    console.log('reading path');
    const dataPath = path.join(rootPath, 'data', 'person-data.json');
    const data = fs.readFileSync(dataPath, 'utf8', );
    return data;
};

export function writeJsonLocationData(locationData, rootPath) {
    const dataPath = path.join(rootPath, 'data', 'person-data.json');
    fs.writeFileSync(dataPath, locationData);
    console.log('file written successfully');
};