import fs from 'fs';
import path from 'path';

export async function getJSON(req, res, rootPath) {
    const dataPath = path.join(rootPath, 'data', 'capitals.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(data);
  });
}

    


