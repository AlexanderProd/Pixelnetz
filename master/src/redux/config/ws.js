import { INIT_TIME_SYNC } from '../../../../shared/dist/util/socketActionTypes';
import createSender from '../../../../shared/dist/util/createSender';

const connectStoreToWS = (store) => {
  const socket = new WebSocket(
    // HOSTNAME & PORT kommen aus webpack.DefinePlugin
    // und wird im Buildprozess gesetzt
    // eslint-disable-next-line no-undef
    `ws://${HOSTNAME}${PORT ? ':' : ''}${PORT}/master`,
  );
  const send = createSender(socket);

  socket.onmessage = ({ data }) => {
    const { actionType, ...message } = JSON.parse(data);

    if (actionType === INIT_TIME_SYNC) {
      send({
        actionType: INIT_TIME_SYNC,
        initCounter: message.initCounter,
        clientReceive: Date.now(),
      });
    } else {
      store.dispatch({
        type: actionType,
        message,
      });
    }
  };
};

export default connectStoreToWS;
