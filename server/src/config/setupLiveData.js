import {
  CURRENT_CONNECTIONS,
  CONNECTION_ADDED,
  CONNECTION_REMOVED,
  ALL_SEQUENCES,
} from '../../../shared/util/socketActionTypes';
import readSavedFiles from '../util/readSavedFiles';

const setupLiveData = ({ masterPool, clientPool }) => {
  masterPool.onConnection((masterSocket) => {
    const currentConnections = [];
    clientPool.forEachSync(
      client => currentConnections.push(client.info()),
    );
    masterSocket.send({
      actionType: CURRENT_CONNECTIONS,
      connections: currentConnections,
    });

    masterSocket.send({
      actionType: ALL_SEQUENCES,
      data: readSavedFiles(),
    });
  });

  clientPool.onPosition(clientSocket => masterPool.sendAll({
    actionType: CONNECTION_ADDED,
    connection: clientSocket.info(),
  }));

  clientPool.onClose(id => masterPool.sendAll({
    actionType: CONNECTION_REMOVED,
    id,
  }));
};

export default setupLiveData;
