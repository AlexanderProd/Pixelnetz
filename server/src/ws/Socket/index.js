import createSender from '../../util/createSender';

class Socket {
  constructor({ socket, id, ip, deltaTime }) {
    this._socket = socket;
    this._deltaTime = deltaTime;
    this._id = id;
    this._ip = ip;
    this._joinTime = Date.now();
    this._send = createSender(this._socket);
    this.properties = {};
  }

  send(data) {
    this._send(data);
  }

  deltaTime() {
    return this._deltaTime;
  }

  id() {
    return this._id;
  }

  ip() {
    return this._ip;
  }

  joinTime() {
    return this._joinTime;
  }

  info() {
    return ({
      deltaTime: this._deltaTime,
      id: this._id,
      ip: this._ip,
      joinTime: this._joinTime,
      properties: this.properties,
    });
  }
}

export default Socket;
