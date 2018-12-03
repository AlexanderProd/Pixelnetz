import readSavedFiles from '../util/readSavedFiles';

const savedFiles = () => (req, res) => {
  try {
    const fileList = readSavedFiles();
    res.status(200).json(fileList);
  } catch (e) {
    res.status(500).json({ error: 'Error reading saved files' });
  }
};

export default savedFiles;
