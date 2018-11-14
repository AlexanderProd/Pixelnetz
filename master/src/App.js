import React from 'react';
import { Icon } from './components/ui';
import LoginForm from './components/LoginForm';
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
    <LoginForm />
  </div>
);

export default App;
