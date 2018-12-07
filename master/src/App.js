import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardGrid } from './components/ui';
import LoginForm from './components/LoginForm';
import AnimationControls from './components/AnimationControls';
import SequenceSelector from './components/SequenceSelector';
import ConnectionCounter from './components/ConnectionCounter';
import ConnectionsList from './components/ConnectionsList';
import FileUpload from './components/FileUpload';
import Preview from './components/Preview';
import TitleBar from './components/TitleBar';
import { authType } from './types';
import './App.sass';

const propTypes = {
  auth: PropTypes.shape(authType),
};

const defaultProps = {
  auth: null,
};

export const App = ({ auth }) => (
  <div className="App">
    <TitleBar />
    {auth
      ? (
        <CardGrid>
          <Card title="Sequence Control">
            <AnimationControls />
          </Card>
          <Card title="Sequences" spanRows={2}>
            <SequenceSelector />
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
          <Card title="Connections List" spanCols={2} spanRows={2}>
            <ConnectionsList />
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
