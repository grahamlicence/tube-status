 /*
  * Lines Test
  */
 
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';
import expect from 'expect';

import CloseBtn from '../CloseBtn';

describe('CloseBtn', () => {

    jsdom();

    it('Changes the text after click', () => {
       var closeBtn = TestUtils.renderIntoDocument(
          <CloseBtn />
        );

        var closeBtnNode = ReactDOM.findDOMNode(closeBtn);

        TestUtils.Simulate.click(closeBtnNode);
        expect(window.close).toBeCalled;
    });

});