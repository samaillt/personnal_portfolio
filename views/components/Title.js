var React = require('react');

class Title extends React.Component {
  render() {
    var data = this.props;

    return (
      <div id="title-container">
        <h1 id="title" className="disable_select">{data.title}</h1>
        <h2 id="subtitle" className="disable_select">{data.subtitle}</h2>
        <p id="click_info" className="disable_select">{data.click_info}</p>
      </div>
    );
  }
}

module.exports = Title;