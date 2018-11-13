/* eslint-disable */
// https://medium.com/@kayodeniyi/setting-up-tests-for-react-using-mocha-expect-and-enzyme-8f53af96fe7e
process.env.NODE_ENV = 'test';

require('@babel/polyfill');
require('@babel/register')();

require.extensions['.sass'] = function () { return null ;};
require.extensions['.css'] = function () { return null ;};

var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
