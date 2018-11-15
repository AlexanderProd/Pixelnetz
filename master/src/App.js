import React from 'react';
import { Icon, Card, CardGrid } from './components/ui';
import LoginForm from './components/LoginForm';
import AnimationControls from './components/AnimationControls';
import FileUpload from './components/FileUpload';
import './App.sass';
import Preview from './components/Preview';

const App = () => (
  <div className="App">
    <div className="titlebar">
      <h1 className="title-header">Pixelnetz Master</h1>
      <a
        className="dashboard-link"
        href="http://3.120.26.9:2800"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="dashboard" />
        <span>Dashboard</span>
      </a>
    </div>
    <CardGrid>
      <Card title="Login">
        <LoginForm />
      </Card>
      <Card title="Sequence Control">
        <AnimationControls />
      </Card>
      <Card title="Upload Image" spanRows={2}>
        <FileUpload />
      </Card>
      <Card title="Realtime Preview" spanRows={2}>
        <Preview />
      </Card>
    </CardGrid>
  </div>
);

export default App;
