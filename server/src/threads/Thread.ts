import { Worker, MessageChannel, MessagePort } from 'worker_threads';
import Emitter from '../ws/Emitter';

const generateKey = () =>
  `${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`.padStart(
    16,
    '0',
  );

export interface ResultData<ThreadOutput> {
  result: ThreadOutput;
  id: string;
}

class Thread<ThreadInput, ThreadOutput> extends Emitter {
  private worker: Worker;

  readonly id: string;

  port: MessagePort;

  active: boolean;

  busy: boolean;

  constructor(path: string) {
    super(['actionperformed']);
    this.id = generateKey();
    this.active = false;
    this.busy = false;
    const { port1, port2 } = new MessageChannel();
    this.worker = new Worker(path, {
      workerData: {
        id: this.id,
      },
    });
    this.worker.on('online', () => {
      this.active = true;
    });
    this.worker.on('exit', () => {
      this.active = false;
    });
    this.worker.postMessage({ port: port2, type: 'SET_PORT' }, [
      port2,
    ]);
    this.port = port1;
    this.port.on('message', message => {
      // eslint-disable-next-line default-case
      switch (message.type) {
        case 'ACTION_RESULT': {
          const out: ResultData<ThreadOutput> = message.output;
          this.busy = false;
          this.emit('actionperformed', out);
          break;
        }
      }
    });
  }

  on(
    event: 'actionperformed',
    listener: (output: ResultData<ThreadOutput>) => void,
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  on(event: string, listener: (...args: any[]) => void): void;

  // eslint-disable-next-line no-dupe-class-members
  on(event: string, listener: (...args: any[]) => void): void {
    super.on(event, listener);
  }

  emit(
    event: 'actionperformed',
    output: ResultData<ThreadOutput>,
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  emit(event: string, ...args: any[]): void;

  // eslint-disable-next-line no-dupe-class-members
  emit(event: string, ...args: any[]): void {
    super.emit(event, ...args);
  }

  performAction(data: ThreadInput) {
    this.busy = true;
    this.port.postMessage({
      type: 'PERFORM_ACTION',
      data,
    });
  }

  close() {
    this.worker.terminate();
    if (this.port) {
      this.port.close();
    }
    this.active = false;
  }
}

export default Thread;
