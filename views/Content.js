var React = require('react');
var Title = require('./components/Title');
var Projects = require('./components/Projects');
var About = require('./components/About');
var Menu = require('./components/Menu');

class Content extends React.Component {
  constructor(props) {
    super(props)
    this.state = { page: "title" }
    this.setTitle = this.setTitle.bind(this);
    this.setProjects = this.setProjects.bind(this);
    this.setAbout = this.setAbout.bind(this);
    this.tabButton = this.tabButton.bind(this);
  }

  setTitle() {
    console.log("title");
    return this.setState({
      ...this.state,
      page: "title"
    });
  }

  setProjects() {
    console.log("projects");
    return this.setState({
      ...this.state,
      page: "projects"
    });
  }

  setAbout() {
    console.log("about");
    return this.state = {
      ...this.state,
      page: "about"
    };
  }

  tabButton() {
    console.log("tapped");
  }

  render() {
    var data = this.props;

    return (
      <div id="content-container">
        {this.state.page == "title" && <Title {...data}/>}
        {this.state.page == "projects" && <Projects {...data}/>}
        {this.state.page == "about" && <About {...data}/>}
        <Menu setTitle={this.setTitle} setProjects={this.setProjects} setAbout={this.setAbout}/>
        <canvas id="mon_canvas"/>
      </div>
    );
  }
}

module.exports = Content;