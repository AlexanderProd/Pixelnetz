import { ALL_SEQUENCES } from '../../../shared/util/socketActionTypes';
import readSavedFiles from '../util/readSavedFiles';

const sendAllSequences = pool => pool.sendAll({
  actionType: ALL_SEQUENCES,
  data: readSavedFiles(),
});

export default sendAllSequences;
