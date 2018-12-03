/* eslint-disable */
process.env.NODE_ENV = 'test';

require('@babel/register')();

var chai = require('chai')
var chaiHTTP = require('chai-http');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiHTTP);
