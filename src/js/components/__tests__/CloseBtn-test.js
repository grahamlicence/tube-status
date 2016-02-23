jest.dontMock('../CloseBtn');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const CloseBtn = require('../CloseBtn');

describe('CloseBtn', () => {

  it('changes the text after click', () => {

    // Render a closeBtn in the document
    var closeBtn = TestUtils.renderIntoDocument(
      <CloseBtn />
    );

    var closeBtnNode = ReactDOM.findDOMNode(closeBtn);

    TestUtils.Simulate.click(closeBtnNode);
    expect(window.close).toBeCalled;
  });

});