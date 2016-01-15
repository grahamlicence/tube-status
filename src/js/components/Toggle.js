var React = require('react');

const Toggle = React.createClass({

    _click: function () {
        console.log(this)
    },

  render: function(){
    return (
      <button onClick={this._click} className={"toggle-btn " + (this.props.item.active ? '' : 'off')}>
        <span className="line">{this.props.item.line}</span>
        <span className="status">{this.props.item.status}</span>
        <span className="message">No updates set</span>
      </button>
    )  
  }
});

module.exports = Toggle;