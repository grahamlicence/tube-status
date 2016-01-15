var React = require('react');

const List = React.createClass({
  render: function(){
    return (
      <ul className={this.props.className}>
      {
        this.props.items.map(function(item) {
          return <li key={item.line}>
                <p className={item.line.toLowerCase().replace(/\s/g, '-')}>
                  <span className="line">{item.line}</span>
                </p>
            </li>
        })
       }
      </ul>
    )  
  }
});

module.exports = List;