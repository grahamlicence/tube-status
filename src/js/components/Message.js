var React = require('react');

const Message = React.createClass({

    propTypes: {
        id: React.PropTypes.string,
        msg: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            className: 'update-message'
        };
    },

    /**
     * Hide message when closed and store Id so not shown again
     */
    _click: function () {
        this.setState({className: 'update-message hidden'});

        localStorage.messageShown = this.refs.id.value;
    },

    /**
     * Check if message has been previously closed
     */
    _showMessage: function (id) {

        if (!localStorage.messageShown) {
            return true;
        } else if (localStorage.messageShown < id) {
            return true;
        } else {
            return false;
        }
    },

    render: function() {
        var message;
        if (this._showMessage(this.props.id)) {
            message = (
                <p>
                    <strong>Update:</strong>
                    {this.props.msg}
                    <button onClick={this._click} ref="id" value={this.props.id} className="msg-close">ok</button>
                </p>
            )
        }
        return <div className={this.state.className}>{message}</div>
    }
});

module.exports = Message;