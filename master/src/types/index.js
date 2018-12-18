import {
  string,
  number,
  shape,
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
  xOffset: number,
  yOffset: number,
  width: number,
  height: number,
};
