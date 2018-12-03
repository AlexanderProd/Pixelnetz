import { unlink, existsSync } from 'fs';

const savedFiles = () => (req, res) => {
  const path = `${__dirname}/../../db/${req.query.name}.json`;

  try {
    if (existsSync(path)) {
      unlink(path, (err) => {
        if (err) throw err && res.send(err);
        res.status(200).send('Deleted succesfully.');
      });
    } else {
      res.status(404).send('File does not exist!');
    }
  } catch (err) {
    console.error(err);
  }
};

export default savedFiles;
