var React = require('react');

const Details = React.createClass({

    render: function() {
        var details = this.props.item.split('\n').map(function(item, count) {
            if (item.length) {
                return (
                    /* jshint ignore:start */
                    <span key={count} className="details">
                        {item}
                    </span>
                    /* jshint ignore:end */
                );
            }
        });

        return (
            /* jshint ignore:start */
            <span className="details-wrapper">
                {details}
            </span>
            /* jshint ignore:end */
        );
    }
});

module.exports = Details;

