import {
  CURRENT_CONNECTIONS,
  NEW_CONNECTIONS,
  CLOSED_CONNECTIONS,
  ALL_SEQUENCES,
} from '../../../shared/dist/util/socketActionTypes';
import Sequence from '../sequences/Sequence';

const setupLiveData = ({ masterPool, clientPool }) => {
  masterPool.onConnection(async (masterSocket) => {
    const currentConnections = [];
    clientPool.forEachSync(
      client => currentConnections.push(client.info()),
    );
    masterSocket.send({
      actionType: CURRENT_CONNECTIONS,
      connections: currentConnections,
    });

    try {
      const sequences = await Sequence.listAvailable();
      masterSocket.send({
        actionType: ALL_SEQUENCES,
        data: sequences,
      });
    } catch (e) {
      console.error('Failed to send sequence info to master');
    }
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
