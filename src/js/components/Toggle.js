var React = require('react');
var Actions = require('../actions/Actions');
var Details = require('./Details');

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
            <span className="status">{this.props.item.description[this.props.item.description.length - 1]}</span>
            
            <span className="message">No updates set</span>
            <span className={"toggle " + (this.props.item.active ? 'on' : 'off')}></span>
            
            {this.props.item.details.map(function(item, count) {
              return (
                    <Details key={count} item={item} />
                )
            })}
        </button>
    )  
  }
});

module.exports = Toggle;