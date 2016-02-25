jest.dontMock('../Details');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Details = require('../Details');

describe('Details', () => {

  it('changes the text after click', () => {

    // Render a closeBtn in the document
    var details = TestUtils.renderIntoDocument(
      <Details key='1' item='Severe delays due to earlier emergency engineering work.'/>
    );

    var detailsNode = ReactDOM.findDOMNode(details);

    TestUtils.Simulate.click(detailsNode);
    expect(detailsNode.textContent).toEqual('Severe delays due to earlier emergency engineering work.');
  });

});