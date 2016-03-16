/*globals chrome */
var React = require('react');

var Store = require('../stores/TubeStore');
var Actions = require('../actions/Actions');
var CloseBtn = require('./CloseBtn');
var Lines = require('./Lines');
// var Message = require('./Message');

/**
 * Retrieve the current data from the Store
 */
function getState() {
  return {
    items: Store.getData()
  };
}

const Popup = React.createClass({

    getInitialState: function() {
        return {
            items: []
        };
    },
    
    componentWillMount: function(){
        Store.addChangeListener(this._onChange);
    },

    componentDidMount: function() {
        var self = this;
        Actions.updateData();

        // listener for background data updates
        chrome.runtime.onMessage.addListener(
            function(request) {
            if (request.msg === 'dataupdate') {
                Actions.updateData();
            } else if (request.msg === 'dataupdateerror') {
                if (!self._updateError) {
                    self._updateError = true;
                    Actions.updateData();

                    // add a delay to prevent multiple update requests
                    setTimeout(function () {
                        self._updateError = false;
                    }, 30000);
                }
            }
        });
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    _updateError: false,
  
    /**
     * Update state when changed
     */
    _onChange: function() {
        this.setState(getState());
    },

    render: function(){
        return (
            <div className="tube-status">
                <CloseBtn />
                <Lines className="lines" 
                    items={this.state.items} />

                {/* remove message for release 2.1.0 
                <Message id="3" msg="Extension update coming soon to use the new TfL API. There'll be a permissions update for the TfL url and a new Chrome API for checking the feed." />
                */}
            </div>
        );
    }
});

module.exports = Popup;