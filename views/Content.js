var React = require('react');

class Content extends React.Component {
  render() {
    var data = this.props;

    return (
      <div id="content-container">
        <h1 id="title" className="disable_select">{data.title}</h1>
        <h2 id="subtitle" className="disable_select">{data.subtitle}</h2>
        <p id="text" className="disable_select">{data.text}</p>
        <div id="icons">
          <a href="https://github.com/samaillt" target="_blank"><i className="fab fa-github"></i></a>        
          <a href="https://www.youtube.com/channel/UCtLCj7g000uBapYeMFK7kHQ/videos" className="_blank"><i className="fab fa-youtube"></i></a>
          <a href="https://fr.linkedin.com/in/tom-samaille/" target="_blank"><i className="fab fa-linkedin"></i></a>
          <a href="https://www.instagram.com/tom_samaille/" target="_blank"><i className="fab fa-instagram"></i></a>
          <a href="https://www.behance.net/tomsamaille" target="_blank"><i className="fab fa-behance"></i></a>
        </div>
        <p id="click_info" className="disable_select">{data.click_info}</p>
      </div>
    );
  }
}

module.exports = Content;