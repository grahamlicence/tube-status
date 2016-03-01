var React = require('react');

const Details = React.createClass({

    propTypes: {
        item: React.PropTypes.string
    },

    render: function() {
        var details = this.props.item.split('\n').map(function(item, count) {
            if (item.length) {
                return (
                    <span key={count} className="details">
                        {item}
                    </span>
                );
            }
        });

        return (
            <span className="details-wrapper">
                {details}
            </span>
        );
    }
});

module.exports = Details;

