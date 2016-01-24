var React = require('react');

const Details = React.createClass({

    render: function() {
        return (
            <span className="details-wrapper">
                {this.props.item.split('\n').map(function(item, count) {
                      return (
                        <span key={count} className="details">
                          {item}
                        </span>
                      )
                })}
            </span>
        )  
    }
});

module.exports = Details;

