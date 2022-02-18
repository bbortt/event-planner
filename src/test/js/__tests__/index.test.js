import React from 'react';

import { render } from '../test-utils';

import HomePage from '../../../pages';

describe('HomePage', () => {
  it('should have a loading text per default', () => {
    const tree = render(<HomePage />).container;
    expect(tree).toMatchSnapshot();
  });
});
