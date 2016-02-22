var React = require('react');
var Actions = require('../actions/Actions');
var Details = require('./Details');

const Toggle = React.createClass({

    propTypes: {
        item: React.PropTypes.object
    },

    /**
     * Update saved lines
     */
    _click: function () {
        Actions.set(this.props.item.id, this.props.item.active);
    },

    render: function(){
        return (
            /* jshint ignore:start */
            <button 
                type="button" 
                onClick={this._click} 
                className={"toggle-btn " + (this.props.item.active ? '' : 'off')}>
                
                {/* Line name */}
                <span className="line">{this.props.item.line}</span>
                
                {/* Line status */}
                <span className="status">
                    {this.props.item.description.map(function(item, count) {
                      return (
                            <span key={count} 
                                className="status-item">{item}</span>
                        )
                    })}
                </span>
                
                <span className="message">No updates set</span>
                <span className={"toggle " + (this.props.item.active ? 'on' : 'off')}></span>
                
                {this.props.item.details.map(function(item, count) {
                  return (
                        <Details key={count} 
                            item={item} />
                    )
                })}
            </button>
            /* jshint ignore:end */
        );
    }
});

module.exports = Toggle;