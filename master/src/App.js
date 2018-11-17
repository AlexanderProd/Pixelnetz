import React from 'react';
import { Card, CardGrid } from './components/ui';
import LoginForm from './components/LoginForm';
import AnimationControls from './components/AnimationControls';
import FileUpload from './components/FileUpload';
import Preview from './components/Preview';
import TitleBar from './components/TitleBar';
import './App.sass';

const App = () => (
  <div className="App">
    <TitleBar />
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
