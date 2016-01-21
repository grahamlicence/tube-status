var React = require('react');
var Actions = require('../actions/Actions');

const Toggle = React.createClass({

  _click: function () {
      Actions.set(this.props.item.id, this.props.item.active);
  },

  render: function(){
    return (
        <button type="button" onClick={this._click} className={"toggle-btn " + (this.props.item.active ? '' : 'off')}>
            
            {/* Line name */}
            <span className="line">{this.props.item.line}</span>
            
            {/* Line status */}
            <span className="status">{this.props.item.description}</span>
            <span className="message">No updates set</span>
            <span className={"toggle " + (this.props.item.active ? 'on' : 'off')}></span>

            {/* only show details if available */}
            {this.props.item.details.split('\n').map(function(item, count) {
                if (item.length) {
                  return (
                    <span key={count} className="details">
                      {item}
                    </span>
                  )
                }
            })}
        </button>
    )  
  }
});

module.exports = Toggle;