import { readdirSync } from 'fs';

const savedFiles = () => (req, res) => {
  const fileList = readdirSync(`${__dirname}/../../db/`)
    .map(fileName => fileName.split('.json')[0]);
  console.log(fileList);
  res.status(200).json(fileList);
};

export default savedFiles;
