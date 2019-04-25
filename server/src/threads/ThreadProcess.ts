import { parentPort, workerData, MessagePort } from 'worker_threads';
import { ResultData } from './Thread';

export interface ThreadMessage {
  type: string;
  [key: string]: any;
}

export interface InitializePortMessage extends ThreadMessage {
  type: 'SET_PORT';
  port: MessagePort;
}

export interface PerformActionMessage<ThreadInput>
  extends ThreadMessage {
  type: 'PERFORM_ACTION';
  data: ThreadInput;
}

export type ProcessAction<ThreadInput, ThreadOutput> = (
  data: ThreadInput,
  id: string,
) => Promise<ThreadOutput> | ThreadOutput;

class ThreadProcess<ThreadInput, ThreadOutput> {
  ready: boolean;

  busy: boolean;

  port: MessagePort | null;

  readonly id: string;

  private action: ProcessAction<ThreadInput, ThreadOutput>;

  constructor(action: ProcessAction<ThreadInput, ThreadOutput>) {
    const { id } = workerData;
    this.id = id;
    this.action = action;
    this.ready = false;
    this.busy = false;
    this.port = null;

    if (!parentPort) throw new Error('No parentPort');

    parentPort.once('message', (message: ThreadMessage) => {
      if (message.type === 'SET_PORT') {
        const { port } = message as InitializePortMessage;
        this.port = port;
        this.ready = true;

        this.port.on(
          'message',
          async (threadMessage: ThreadMessage) => {
            if (threadMessage.type === 'PERFORM_ACTION') {
              const { data } = threadMessage as PerformActionMessage<
                ThreadInput
              >;
              this.busy = true;
              await this.perform(data);
              this.busy = false;
            }
          },
        );
      }
    });
  }

  private async perform(data: ThreadInput) {
    const result = await Promise.resolve(this.action(data, this.id));
    if (!this.ready) throw new Error('Process is not ready');
    const output: ResultData<ThreadOutput> = {
      result,
      id: this.id,
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.port!.postMessage({
      type: 'ACTION_RESULT',
      output,
    });
  }
}

export default ThreadProcess;
