var React = require('react');

const Message = React.createClass({

    // Close the message when clicked
    _click: function () {
        this.setState({className: 'update-message hidden'});

        localStorage.messageShown = this.refs.id.value;
    },

    _showMessage: function (id) {

        if (!localStorage.messageShown) {
            return true;
        } else if (localStorage.messageShown < id) {
            return true;
        } else {
            return false;
        }
    },

    getInitialState: function() {
        return {
            className: 'update-message'
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