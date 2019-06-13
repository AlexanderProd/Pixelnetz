import {
  CURRENT_CONNECTIONS,
  NEW_CONNECTIONS,
  CLOSED_CONNECTIONS,
  SELECTED_AUDIO_FILES,
} from '../../../shared/src/util/socketActionTypes';
import MasterPool from '../ws/MasterPool';
import ClientPool from '../ws/ClientPool';
import { SocketInfo } from '../ws/Socket';
import sendAllAudioFiles from '../util/sendAllAudioFiles';
import sendAllSequences from '../util/sendAllSequences';
import AudioDB from '../audio/AudioDB';

const setupLiveData = ({
  masterPool,
  clientPool,
  audioDB,
}: {
  masterPool: MasterPool;
  clientPool: ClientPool;
  audioDB: AudioDB;
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

    sendAllAudioFiles(masterSocket, audioDB);
    sendAllSequences(masterSocket);
  });

  let newConnections: SocketInfo[] = [];
  let closedConnections: string[] = [];

  clientPool.on('connection', clientSocket =>
    clientSocket.send({
      actionType: SELECTED_AUDIO_FILES,
      fileNames: audioDB.listSelected(),
    }),
  );

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
