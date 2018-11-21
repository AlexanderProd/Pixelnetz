import {
  CURRENT_CONNECTIONS,
  CONNECTION_ADDED,
  CONNECTION_REMOVED,
} from '../../../shared/util/socketActionTypes';

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
  });

  clientPool.onConnection(clientSocket => masterPool.sendAll({
    actionType: CONNECTION_ADDED,
    connection: clientSocket.info(),
  }));

  clientPool.onClose(id => masterPool.sendAll({
    actionType: CONNECTION_REMOVED,
    id,
  }));
};

export default setupLiveData;
