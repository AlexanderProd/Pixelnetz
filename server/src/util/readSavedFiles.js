import { readdirSync } from 'fs';

const readSavedFiles = () => readdirSync(`${__dirname}/../../db/`)
  .map(fileName => fileName.split('.json')[0]);

export default readSavedFiles;
