var React = require('react');

const SaveBtn = React.createClass({

    _click: function () {
        window.close();
    },

    render: function(){
        return (
            <button onClick={this._click} className="popupclosebtn" title="close popup"></button>
        )  
    }
});

module.exports = SaveBtn;