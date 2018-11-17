/* eslint-disable import/prefer-default-export */
import {
  string,
} from 'prop-types';

export const authType = {
  token: string.isRequired,
  expiresIn: string.isRequired,
};
