import WebSocket from 'ws';
import createSender from '../../util/createSender';

export interface SocketInfo {
  deltaTime: number;
  id: string;
  ip?: string;
  joinTime: number;
  properties: any;
}

class Socket {
  private _socket: WebSocket;

  private _deltaTime: number;

  private _id: string;

  private _ip?: string;

  private _joinTime: number;

  private _send: (data: any) => void;

  public properties: any;

  constructor({
    socket,
    id,
    ip,
    deltaTime,
  }: {
    socket: WebSocket;
    id: string;
    ip?: string;
    deltaTime: number;
  }) {
    this._socket = socket;
    this._deltaTime = deltaTime;
    this._id = id;
    this._ip = ip;
    this._joinTime = Date.now();
    this._send = createSender(this._socket);
    this.properties = {};
  }

  send(data: any) {
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

  info(): SocketInfo {
    return {
      deltaTime: this._deltaTime,
      id: this._id,
      ip: this._ip,
      joinTime: this._joinTime,
      properties: this.properties,
    };
  }
}

export default Socket;
