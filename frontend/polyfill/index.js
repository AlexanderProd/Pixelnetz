import P from 'es6-promise';
import 'raf/polyfill';
import 'iterators-polyfill';
import './ArrayFrom';
import './ObjectAssign';
import './Classlist';

if (Promise in window) {
  window.Promise = P;
}
