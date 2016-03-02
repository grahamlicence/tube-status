 /*
  * Message Test
  */
 
import React from 'react';
import ReactDOM from 'react-dom';
import {createRenderer} from 'react-addons-test-utils';

import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);
import assert from 'assert';

import TestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';

import storage from 'mock-local-storage';

import Message from '../Message';

let message, buttonNode;

  
describe('Message', () => {

    jsdom();

    before(function() {
        message = TestUtils.renderIntoDocument(
            <Message id="3" msg="Extension message" />
        );

        buttonNode = TestUtils.findRenderedDOMComponentWithTag(
           message, 'button'
        );
        
    });

    it('Saves the latest message id after click', () => {
        
        // set previous message shown
        localStorage.messageShown = 2;

        TestUtils.Simulate.click(buttonNode);
        expect(localStorage.messageShown).toBe('3');
    });

    
    it('hides the message after click', () => {
        expect(ReactDOM.findDOMNode(message).className).toBe('update-message hidden');
    });

});

