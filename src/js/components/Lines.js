var React = require('react');
var Toggle = require('./Toggle');

const Lines = React.createClass({

  render: function() {
    return (
      <ul className={this.props.className}>
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
    )  
  }
});

module.exports = Lines;