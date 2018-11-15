import React from 'react';
import { Icon, Card, CardGrid } from './components/ui';
import LoginForm from './components/LoginForm';
import AnimationControls from './components/AnimationControls';
import './App.sass';

const App = () => (
  <div className="App">
    <h1>Master</h1>
    <a
      className="dashboard-link"
      href="http://3.120.26.9:2800"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="dashboard" />
      <span>Dashboard</span>
    </a>
    <CardGrid>
      <Card title="Login">
        <LoginForm />
      </Card>
      <Card title="Sequence Control">
        <AnimationControls />
      </Card>
    </CardGrid>
  </div>
);

export default App;
