var React = require('react');
var ReactDOM = require('react-dom');

var Store = require('../stores/TubeStore');
var Actions = require('../actions/Actions');
var CloseBtn = require('./CloseBtn');
var List = require('./Lines');

/**
 * Retrieve the current data from the Store
 */
function getState() {
  return {
    items: Store.getData()
  };
}

const Popup = React.createClass({
  
    // /**
    // * Filter the list by input value
    // * @private
    // * @param {Object} value - filter input text
    // */
    // _filterList: function(event){
    //     var value = event.target.value;
    //     Actions.filter(value);
    // },
    // /**
    // * Event handler for 'change' events coming from the ListStore
    // */
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
        Actions.update();
    },

    render: function(){
        return (
            <div className="tube-status">
                <CloseBtn />
                <List className="lines" items={this.state.items} />
            </div>
        );
    }
});

module.exports = Popup;