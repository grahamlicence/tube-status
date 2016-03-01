 /*
  * Lines Test
  */
 
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import assert from 'assert';
import jsdom from 'mocha-jsdom';

import Details from '../Details';

describe('Details', () => {

    jsdom();

    it('Changes the text after click', () => {
       var details = TestUtils.renderIntoDocument(
            <Details key='1' item='Severe delays due to earlier emergency engineering work.'/>
        );

        var detailsNode = ReactDOM.findDOMNode(details);

        TestUtils.Simulate.click(detailsNode);
        assert(detailsNode.textContent === 'Severe delays due to earlier emergency engineering work.');
    });

});