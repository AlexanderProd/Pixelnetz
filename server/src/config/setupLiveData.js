import {
  CURRENT_CONNECTIONS,
  NEW_CONNECTIONS,
  CLOSED_CONNECTIONS,
  ALL_SEQUENCES,
} from '../../../shared/dist/util/socketActionTypes';
import Sequence from '../sequences/Sequence';

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
      data: Sequence.listAvailable(),
    });
  });

  let newConnections = [];
  let closedConnections = [];

  clientPool.onPosition(
    clientSocket => newConnections.push(clientSocket.info()),
  );

  clientPool.onClose(id => closedConnections.push(id));

  setInterval(() => {
    if (newConnections.length > 0) {
      masterPool.sendAll({
        actionType: NEW_CONNECTIONS,
        connections: newConnections,
      });
      newConnections = [];
    }

    if (closedConnections.length > 0) {
      masterPool.sendAll({
        actionType: CLOSED_CONNECTIONS,
        ids: closedConnections,
      });
      closedConnections = [];
    }
  }, 1000);
};

export default setupLiveData;
