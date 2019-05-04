import Queue from '../Queue';
import expandFrames from '../animationController/expandFrames';

class FrameQueue extends Queue {
  constructor({ frames, stepLength }) {
    super(expandFrames(frames, stepLength));
    this._stepLength = stepLength;
  }

  appendFrame(frame) {
    this.enqueue({
      ...frame,
      frameTime:
        frame.duration * this._stepLength + this.tail().frameTime,
    });
  }

  appendSequence({ frames, stepLength }) {
    expandFrames(frames, stepLength, this.tail().frameTime).forEach(
      frame => this.enqueue(frame),
    );
  }
}

export default FrameQueue;
