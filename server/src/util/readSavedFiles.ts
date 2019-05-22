import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);

async function readSavedFiles(): Promise<string[]> {
  return readdir(`${__dirname}/../../db/`).then(list =>
    list.map(fileName => fileName.split('.json')[0]),
  );
}

export default readSavedFiles;
