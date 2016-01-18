var React = require('react');
var Toggle = require('./Toggle');

const List = React.createClass({

  render: function(){
    return (
      <ul className={this.props.className}>
      {
        this.props.items.map(function(item) {
          return <li key={item.line}>
                <p className={item.line.toLowerCase().replace(/\s/g, '-')}>
                  <Toggle item={item} />
                </p>
            </li>
        })
       }
      </ul>
    )  
  }
});

module.exports = List;