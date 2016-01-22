var React = require('react');
var ReactDOM = require('react-dom');

var Store = require('../stores/TubeStore');
var Actions = require('../actions/Actions');
var CloseBtn = require('./CloseBtn');
var Lines = require('./Lines');

/**
 * Retrieve the current data from the Store
 */
function getState() {
        console.log('--got the state')
        // console.log(this.state.items)
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
        // Actions.get();
        // 
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
        var name = this.state.items.length ? this.state.items[0].line : 'nope';
        return (
            <div className="tube-status">
                <CloseBtn />
                <p>{name}</p>
            </div>
        );
    }
                // <Lines className="lines" items={this.state.items} />
});

module.exports = Popup;