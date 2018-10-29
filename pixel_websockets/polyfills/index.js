import P from 'es6-promise';
import f from 'whatwg-fetch';

if (Promise in window) {
  window.Promise = P;
}

if (fetch in window) {
  window.fetch = f;
}
