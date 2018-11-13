import { expect } from 'chai';
import extractPosition from './extractPosition';

describe('extractPosition', () => {
  it('returns x and y on standard query', () => {
    const pos = extractPosition('?x=3&y=1');
    expect(pos).to.deep.equal({ x: '3', y: '1' });
  });

  it('returns only x when y is missing', () => {
    const pos = extractPosition('?x=3');
    expect(pos).to.deep.equal({ x: '3' });
  });
});
