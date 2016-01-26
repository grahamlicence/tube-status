var React = require('react');
var h = require('../helpers');
var Store = require('../stores/TubeStore');

const LastUpdate = React.createClass({

    _time: 0,

    _lastUpdate: function () {
        var timepassed = h.minutesAgo(this._time),
            stateText = timepassed.text;

        // chrome inactive or too much time passed, force update
        if (timepassed.time > 10) {
            chrome.runtime.sendMessage({msg: 'dataoutofdate'});
            stateText = 'updating now';
        }

        // update state
        this.setState({
            updated: stateText
        });
    },

    _set: function () {
        this._time = Store.getData().updated;
        this._lastUpdate();
    },

    _checker: {},

    getInitialState: function() {
        return {
            updated: 'updating now'
        }
    },
    
    componentWillMount: function(){
        Store.addChangeListener(this._set);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._set);
        clearInterval(this._checker);
    },

    componentDidMount: function() {
        var _this = this;
        this._checker = setInterval(function () {
            _this._lastUpdate();
        }, 10000);
    },

    render: function() {
        return (
            <li>Last updated: {this.state.updated}</li>
        )  
    }
});

module.exports = LastUpdate;