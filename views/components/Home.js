var React = require('react');

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.projectButtonOnclick = this.projectButtonOnclick.bind(this);
  }

  projectButtonOnclick(ev) {
    window.location.href = this.props.lang == "fr" ? '/projects' : '/en/projects';
  }

  render() {
    var data = this.props;
    var render_click_info = false;
    var click_info = <p id="click_info" className="disable_select">{data.click_info}</p>
    var project_button = <p id="project_button" className="disable_select disable_lightspeed"><span onClick={(e) => {this.projectButtonOnclick(e)}} className="disable_select disable_lightspeed" data-letters={data.project_button}>{data.project_button}</span></p>

    return (
      <div id="title-container">
        <h1 id="title" className="disable_select">{data.title}</h1>
        <h2 id="subtitle" className="disable_select">{data.subtitle}</h2>
        {render_click_info ? click_info:project_button}
      </div>
    );
  }
}

module.exports = Home;