import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import { LoginForm } from '.';
import { Form, Input, Button } from '../ui';

describe('LoginForm', () => {
  const mockProps = {
    authenticate: () => null,
  };

  describe('render', () => {
    it('renders without crashing', () => {
      mount(<LoginForm {...mockProps} />);
    });

    it('renders a password Input', () => {
      const wrapper = mount(<LoginForm {...mockProps} />);
      const input = wrapper.find(Input);
      expect(input).to.have.length(1);
      expect(input.props().type).to.equal('password');
    });

    it('renders a Form', () => {
      const wrapper = mount(<LoginForm {...mockProps} />);
      const form = wrapper.find(Form);
      expect(form).to.have.length(1);
    });

    it('renders a Button', () => {
      const wrapper = mount(<LoginForm {...mockProps} />);
      const button = wrapper.find(Button);
      expect(button).to.have.length(1);
    });
  });

  describe('authenticate', () => {
    it('calls authenticate with provided password', () => {
      const mockAuth = spy();
      const wrapper = mount(<LoginForm authenticate={mockAuth} />);
      const pw = 'test-password';
      wrapper.find('input').simulate('change', { target: { value: pw } });
      wrapper.find(Form).simulate('submit');
      expect(mockAuth).to.be.calledWith(pw);
    });
  });
});
