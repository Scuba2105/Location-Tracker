import fs from 'fs';
import path from 'path';

export async function getJsonCountries(req, res, rootPath) {
    const dataPath = path.join(rootPath, 'data', 'capitals.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(data);
  });
}

export async function getJsonLocationData(req, res, rootPath) {
    const dataPath = path.join(rootPath, 'data', 'person-data.json');
    const data = fs.readFileSync(dataPath, 'utf8', );
    return data;
}

    


