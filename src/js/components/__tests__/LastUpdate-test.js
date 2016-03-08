 /*
  * LastUpdate Test
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
import chrome from 'sinon-chrome';

import LastUpdate from '../LastUpdate';

  
describe('LastUpdate', () => {
    
    before(function () {
        global.chrome = chrome;
    });

    // render into dom for this test
    it('Should show updating now message', () => {

        let renderer = createRenderer();
        let date = 1457089793152
        renderer.render(<LastUpdate updated={date} />);

        let expectedElement = (<li className="last-update">Last updated: updating now </li>)
        let actualElement = renderer.getRenderOutput();

        expect(actualElement).toEqualJSX(expectedElement);
    });

    it('Should show Last updated: 32s ago', () => {

        let renderer = createRenderer();
        let date = Date.now() - 32000;
        renderer.render(<LastUpdate updated={date} />);

        let expectedElement = (<li className="last-update">Last updated: 32s ago </li>)
        let actualElement = renderer.getRenderOutput();

        expect(actualElement).toEqualJSX(expectedElement);
    });

    it('Should show Last updated: 3 minutes ago', () => {

        let renderer = createRenderer();
        let date = Date.now() - (3 * 60000);
        renderer.render(<LastUpdate updated={date} />);

        let expectedElement = (<li className="last-update">Last updated: 3 minutes ago </li>)
        let actualElement = renderer.getRenderOutput();

        expect(actualElement).toEqualJSX(expectedElement);
    });
});