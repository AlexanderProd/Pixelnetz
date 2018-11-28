import { readdirSync } from 'fs';

const savedFiles = () => (req, res) => {
  const fileList = readdirSync(`${__dirname}/../../db/`)
    .map(fileName => fileName.split('.json')[0]);
  res.status(200).json(fileList);
};

export default savedFiles;
