/* eslint-disable */
// https://medium.com/@kayodeniyi/setting-up-tests-for-react-using-mocha-expect-and-enzyme-8f53af96fe7e
process.env.NODE_ENV = 'test';

require('@babel/register')();

require.extensions['.sass'] = function () { return null ;};
require.extensions['.css'] = function () { return null ;};

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.navigator = { userAgent: 'node.js' };
global.window = document.defaultView;

require('raf/polyfill');

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

documentRef = document;

var chai = require('chai')
var chaiEnzyme = require('chai-enzyme');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiEnzyme);

var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });
