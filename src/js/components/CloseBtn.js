var React = require('react');

const CloseBtn = React.createClass({

    /**
     * Close the popup when clicked
     */
    _click: function () {
        window.close();
    },

    render: function() {
        return (
            /* jshint ignore:start */
            <button onClick={this._click} className="popupclosebtn" title="close popup"></button>
            /* jshint ignore:end */
        );
    }
});

module.exports = CloseBtn;