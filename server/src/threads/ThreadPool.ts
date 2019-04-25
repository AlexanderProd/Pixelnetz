import NUM_CPUS from '../@types/num-cpus';
import Emitter from '../ws/Emitter';
import Thread, { ResultData } from './Thread';

const NUM_THREADS = Math.max(NUM_CPUS - 1, 1);

class ThreadPool<ThreadInput, ThreadOutput> extends Emitter {
  readonly numThreads: number;

  private threads: Thread<ThreadInput, ThreadOutput>[];

  private queue: ThreadInput[];

  constructor({
    path,
    inputData = [],
    numThreads = NUM_THREADS,
  }: {
    path: string;
    inputData?: ThreadInput[];
    numThreads?: number;
  }) {
    super(['actionperformed']);
    this.queue = inputData;
    this.numThreads = numThreads;
    this.threads = [...new Array(this.numThreads)].map(() => {
      const thread = new Thread<ThreadInput, ThreadOutput>(path);
      thread.on('actionperformed', this.handleActionPerformed);
      return thread;
    });
    while (this.next());
  }

  private handleActionPerformed = (
    data: ResultData<ThreadOutput>,
  ) => {
    this.emit('actionperformed', data);
    this.next();
  };

  onActionPerformed(cb: (data: ResultData<ThreadOutput>) => void) {
    this.on('actionperformed', cb);
  }

  performAction(data: ThreadInput) {
    this.queue.unshift(data);
    this.next();
  }

  close() {
    this.threads.forEach(thread => thread.close());
  }

  private next(): boolean {
    if (this.queue.length === 0) return false;
    const thread = this.threads.find(({ busy }) => !busy);
    if (!thread) return false;
    const data = this.queue.pop() as ThreadInput;
    thread.performAction(data);
    return true;
  }
}

export default ThreadPool;

// const pool = new ThreadPool<string, string>({
//   path: `${__dirname}/rasterizeInWorker.js`,
// });
// console.log('started...');

// pool.onActionPerformed(msg => console.log(msg));
// let i = 0;
// setInterval(() => {
//   i++;
//   pool.performAction(`${i}`);
// }, 780);
