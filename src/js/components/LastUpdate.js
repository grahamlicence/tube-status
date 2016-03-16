/*globals chrome */
var React = require('react');
var h = require('../helpers');
var Store = require('../stores/TubeStore');

const LastUpdate = React.createClass({

    propTypes: {
        updated: React.PropTypes.number
    },

    getInitialState: function() {
        return {
            updated: 'updating now',
            errormsg: ''
        };
    },
    
    componentWillMount: function(){
        Store.addChangeListener(this._set);

        // pass in the initial time 
        this._time = this.props.updated;
        this._lastUpdate();
    },

    componentDidMount: function() {
        var _this = this;

        this._checker = setInterval(function () {
            _this._lastUpdate();
        }, 1000);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._set);
        clearInterval(this._checker);
    },

    /**
     * Time of last API call
     */
    _time: 0,

    /**
     * Requested update
     */
    _requestedUpdate: false,

    /**
     * Set text for "Last updated" and check for out of date updates
     */
    _lastUpdate: function () {
        var self = this,
            timepassed = h.minutesAgo(this._time),
            stateText = timepassed.text;

        // chrome inactive or too much time passed, force update
        if (timepassed.minutesAgo > 10 && !this._requestedUpdate) {
            this._requestedUpdate = true;
            chrome.runtime.sendMessage({msg: 'dataoutofdate'});
            stateText = 'updating now';

            // only send request every 60s
            // there's a listener for coming online if currently offline
            setTimeout(function () {
                self._requestedUpdate = false;
            }, 60000);
        }

        // update state
        this.setState({
            updated: stateText
        });
    },

    /**
     * Update state when changed
     */
    _set: function () {
        this.setState({
            errormsg: Store.getErrors()
        });
        this._time = Store.getData().updated;
        this._lastUpdate();
    },

    /**
     * Interval for checking time
     */
    _checker: {},

    render: function() {
        var error = this.state.errormsg ? <span className="update-error"><strong>Error:</strong> {this.state.errormsg}</span> : '',
            showLastUpdate = JSON.parse(localStorage.showLastUpdate || true),
            lastUpdate = showLastUpdate ? 'Last updated: ' + this.state.updated : '';

        return (
            <li className="last-update">{lastUpdate} {error}</li>
        )
    }
});

module.exports = LastUpdate;