import { sosAnimation } from '../../../shared/util/sequence';
import { start } from './animationController';

const startAnimation = ({ startTime }) => start(sosAnimation, startTime);

export default startAnimation;
