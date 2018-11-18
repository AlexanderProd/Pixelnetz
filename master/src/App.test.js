import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { App } from './App';
import TitleBar from './components/TitleBar';
import LoginForm from './components/LoginForm';
import { CardGrid } from './components/ui';

describe('App', () => {
  const mockProps = {
    auth: null,
  };

  const mockAuth = {
    token: 'test-token',
    expiresIn: '1h',
  };

  it('renders header', () => {
    const wrapper = shallow(<App {...mockProps} />);
    expect(wrapper.find(TitleBar)).to.have.length(1);
  });

  it('renders LoginForm when not logged in', () => {
    const wrapper = shallow(<App {...mockProps} />);
    expect(wrapper.find(LoginForm)).to.have.length(1);
  });

  it('does not render LoginForm when logged in', () => {
    const wrapper = shallow(<App auth={mockAuth} />);
    expect(wrapper.find(LoginForm)).to.have.length(0);
  });

  it('renders CardGrid when logged in', () => {
    const wrapper = shallow(<App auth={mockAuth} />);
    expect(wrapper.find(CardGrid)).to.have.length(1);
  });

  it('does not render CardGrid when not logged in', () => {
    const wrapper = shallow(<App {...mockProps} />);
    expect(wrapper.find(CardGrid)).to.have.length(0);
  });
});
