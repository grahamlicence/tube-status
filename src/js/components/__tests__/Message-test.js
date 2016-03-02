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

    describe('Message actions', () => {

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

        it('Hides the message after click', () => {
            expect(ReactDOM.findDOMNode(message).className).toBe('update-message hidden');
        });

    });

    describe('Message not shown', () => {

        it('Doesn\'t show if already shown/clicked', () => {

            let renderer = createRenderer();
            localStorage.messageShown = 4;
            renderer.render(<Message id="3" msg="Extension message" />);

            let actualElement = renderer.getRenderOutput();
            let expectedElement = (<div className="update-message" />);
            expect(actualElement).toEqualJSX(expectedElement);

        });


    });

});