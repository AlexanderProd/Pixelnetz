import P from 'es6-promise';
import { fetch as f } from 'whatwg-fetch';
import 'raf/polyfill';
import 'iterators-polyfill';
import './ArrayFrom';
import './ObjectAssign';

if (Promise in window) {
  window.Promise = P;
}

if (fetch in window) {
  window.fetch = f;
}
