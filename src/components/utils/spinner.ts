import { SpinnerOptions } from '../../types/textbook/interfaces';

const optsSpiner: SpinnerOptions = {
  lines: 15,
  length: 27,
  width: 13,
  radius: 20,
  scale: 1,
  corners: 1,
  speed: 1,
  rotate: 0,
  animation: 'spinner-line-shrink',
  direction: 1,
  color: '#ffa500',
  fadeColor: 'transparent',
  top: '50%',
  left: '50%',
  shadow: '0 0 1px transparent',
  zIndex: 2000000000,
  className: 'spinner',
  position: 'fixed',
};

export default optsSpiner;
