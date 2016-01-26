var React = require('react');
var ReactDOM = require('react-dom');

var Store = require('../stores/TubeStore');
var Actions = require('../actions/Actions');
var CloseBtn = require('./CloseBtn');
var Lines = require('./Lines');
var Message = require('./Message');

/**
 * Retrieve the current data from the Store
 */
function getState() {
  return {
    items: Store.getData()
  };
}

const Popup = React.createClass({
  
    /**
     * Update state when changed
     */
    _onChange: function() {
        this.setState(getState());
    },

    getInitialState: function() {
        return {
            items: []
        }
    },
    
    componentWillMount: function(){
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidMount: function() {
        Actions.updateData();

        // listener for background data updates
        chrome.runtime.onMessage.addListener(
            function(request) {
            if (request.msg === 'dataupdate') {
                Actions.updateData();
            }
        });
    },

    render: function(){
        return (
            <div className="tube-status">
                <CloseBtn />
                <Lines className="lines" items={this.state.items} />

                {/* remove message for release 2.1 */}
                <Message id="3" msg="Extension update coming soon to use the new TfL API. There'll be a permissions update for the TfL url and a new Chrome API for checking the feed." />
            </div>
        );
    }
});

module.exports = Popup;