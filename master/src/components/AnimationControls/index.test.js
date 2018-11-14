import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import { AnimationControls } from '.';
import { Button } from '../ui';

describe('AnimationControls', () => {
  const mockProps = {
    startAnimation: () => null,
    stopAnimation: () => null,
    startError: false,
    stopError: false,
  };

  describe('render', () => {
    it('renders without crashing', () => {
      mount(<AnimationControls {...mockProps} />);
    });

    it('renders two Buttons', () => {
      const wrapper = mount(<AnimationControls {...mockProps} />);
      const button = wrapper.find(Button);
      expect(button).to.have.length(2);
    });
  });

  describe('actions', () => {
    it('calls startAnimation on click', () => {
      const mockStart = spy();
      const wrapper = mount(<AnimationControls {...mockProps} startAnimation={mockStart} />);
      wrapper
        .findWhere(node => node.props().className === 'animation-start-button')
        .simulate('click');
      // eslint-disable-next-line no-unused-expressions
      expect(mockStart).to.be.called;
    });

    it('calls stopAnimation on click', () => {
      const mockStop = spy();
      const wrapper = mount(<AnimationControls {...mockProps} stopAnimation={mockStop} />);
      wrapper
        .findWhere(node => node.props().className === 'animation-stop-button')
        .simulate('click');
      // eslint-disable-next-line no-unused-expressions
      expect(mockStop).to.be.called;
    });
  });
});
