var React = require('react');
var h = require('../helpers');
var Store = require('../stores/TubeStore');

const LastUpdate = React.createClass({

    _time: 0,

    _lastUpdate: function () {
        this.setState({
            updated: h.minutesAgo(this._time)
        });
        if (parseInt(h.minutesAgo(this._time)) > 10 && h.minutesAgo(this._time) !== '30s ago') {
            console.log('time has passed ' + h.minutesAgo(this._time))

            chrome.runtime.sendMessage({msg: 'dataoutofdate'});
        }
    },

    _chk: function () {
        console.log('data updated');
        console.log(Store.getData().updated)
        this._time = Store.getData().updated;
        this._lastUpdate();
    },

    getInitialState: function() {
        return {
            updated: 'updating now'
        }
    },
    
    componentWillMount: function(){
        Store.addChangeListener(this._chk);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._chk);
    },

    componentDidMount: function() {
        var _this = this,
            checker = setInterval(function () {
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