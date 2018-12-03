import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardGrid } from './components/ui';
import LoginForm from './components/LoginForm';
import AnimationControls from './components/AnimationControls';
import SequenceSelector from './components/SequenceSelector';
import ConnectionCounter from './components/ConnectionCounter';
import FileUpload from './components/FileUpload';
import Preview from './components/Preview';
import TitleBar from './components/TitleBar';
import { authType } from './types';
import './App.sass';

const propTypes = {
  auth: PropTypes.shape(authType),
  sequences: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  auth: null,
  sequences: ['npm', 'test'],
};

export const App = ({ auth, sequences }) => (
  <div className="App">
    <TitleBar />
    {auth
      ? (
        <CardGrid>
          <Card title="Sequence Control">
            <AnimationControls />
          </Card>
          <Card title="Sequences">
            <SequenceSelector sequenceNames={sequences} />
          </Card>
          <Card title="Connected Users">
            <ConnectionCounter />
          </Card>
          <Card title="Upload Image" spanRows={2}>
            <FileUpload />
          </Card>
          <Card title="Realtime Preview" spanRows={2}>
            <Preview />
          </Card>
        </CardGrid>
      )
      : (
        <div className="login-screen">
          <Card title="Login">
            <LoginForm />
          </Card>
        </div>
      )
    }
  </div>
);

App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(App);
