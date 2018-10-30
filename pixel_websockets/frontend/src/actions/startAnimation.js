import { sosAnimation } from '../../../util/sequence';
import { start } from './animationController';

const startAnimation = ({ startTime }) => start(sosAnimation, startTime);

export default startAnimation;
