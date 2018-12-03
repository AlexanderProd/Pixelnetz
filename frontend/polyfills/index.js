import './regeneratorRuntime';
import P from 'es6-promise';
import { fetch as f } from 'whatwg-fetch';
import 'array-reverse-polyfill';
import 'raf/polyfill';
import './ArrayFrom';
import './ObjectAssign';

if (Promise in window) {
  window.Promise = P;
}

if (fetch in window) {
  window.fetch = f;
}
