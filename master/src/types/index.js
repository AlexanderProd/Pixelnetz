import {
  string,
  number,
  bool,
  shape,
  arrayOf,
  array,
} from 'prop-types';

export const authType = {
  token: string.isRequired,
  expiresIn: string.isRequired,
};

export const connectionType = {
  id: string.isRequired,
  deltaTime: number.isRequired,
  joinTime: number.isRequired,
  properties: shape({}),
};

export const dimensionsType = {
  xOffset: number.isRequired,
  yOffset: number.isRequired,
  width: number.isRequired,
  height: number.isRequired,
};

export const sequenceType = {
  name: string.isRequired,
  repeat: bool.isRequired,
  stepLength: number.isRequired,
  duration: number.isRequired,
  length: number.isRequired,
  width: number.isRequired,
  height: number.isRequired,
  frames: arrayOf(array),
};
