var React = require('react');
var Toggle = require('./Toggle');
var LastUpdate = require('./LastUpdate');

const Lines = React.createClass({

    propTypes: {
        items: React.PropTypes.array,
        className: React.PropTypes.string
    },

    render: function() {
        return (
            <ul className={this.props.className}>
            <LastUpdate updated={this.props.items.updated} />
            {
                this.props.items.map(function(item) {
                  return (
                    <li key={item.line.replace(/ /g,'')}>
                        <p className={item.line.toLowerCase().replace(/\s/g, '-').replace(/\&/g, 'and')}>
                            <Toggle item={item} />
                        </p>
                    </li>
                    )
                })
            }
            </ul>
        );
    }
});

module.exports = Lines;