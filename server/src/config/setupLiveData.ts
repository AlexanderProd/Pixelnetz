import {
  CURRENT_CONNECTIONS,
  NEW_CONNECTIONS,
  CLOSED_CONNECTIONS,
} from '../../../shared/dist/util/socketActionTypes';
import MasterPool from '../ws/MasterPool';
import ClientPool from '../ws/ClientPool';
import { SocketInfo } from '../ws/Socket';
import sendAllAudioFiles from '../util/sendAllAudioFiles';
import sendAllSequences from '../util/sendAllSequences';

const setupLiveData = ({
  masterPool,
  clientPool,
}: {
  masterPool: MasterPool;
  clientPool: ClientPool;
}) => {
  masterPool.on('connection', async masterSocket => {
    const currentConnections: SocketInfo[] = [];
    clientPool.forEachSync(client => {
      currentConnections.push(client.info());
    });

    masterSocket.send({
      actionType: CURRENT_CONNECTIONS,
      connections: currentConnections,
    });

    sendAllAudioFiles(masterSocket);
    sendAllSequences(masterSocket);
  });

  let newConnections: SocketInfo[] = [];
  let closedConnections: string[] = [];

  clientPool.on('position', clientSocket =>
    newConnections.push(clientSocket.info()),
  );

  clientPool.on('close', id => closedConnections.push(id));

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
