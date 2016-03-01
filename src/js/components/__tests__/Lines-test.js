 /*
  * Lines Test
  */
 
import React from 'react';
import expect from 'expect';
import {createRenderer} from 'react-addons-test-utils';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import storage from 'mock-local-storage';

import Lines from '../Lines';
import LastUpdate from '../LastUpdate';
import Toggle from '../Toggle';



const TEST_ITEMS = [
        {
            line: 'Bakerloo'
        },
        {
            line: 'Central'
        }
    ];
    TEST_ITEMS.severity = 'delay';
    TEST_ITEMS.updated = 1456240801161;
  
describe('Lines', () => {

  it('Renders correctly', () => {

    let items = TEST_ITEMS;
    let renderer = createRenderer();
    renderer.render(<Lines className="lines" items={items} />);
    let actualElement = renderer.getRenderOutput();

    let expectedElement = (
        <ul className="lines">
            <LastUpdate updated={1456240801161} />
            <li>
              <p className="bakerloo">
                <Toggle item={{line: 'Bakerloo'}} />
              </p>
            </li>
            <li>
              <p className="central">
                <Toggle item={{line: 'Central'}} />
              </p>
            </li>
        </ul>);

    expect(actualElement).toEqualJSX(expectedElement);
  });
});
