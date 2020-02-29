var React = require('react');
var Title = require('./components/Title');
var Projects = require('./components/Projects');
var About = require('./components/About');
var Menu = require('./components/Menu');

class Content extends React.Component {
  constructor(props) {
    super(props)
    this.state = { page: "title" }
    this.titleMenuElementMouseOver = this.titleMenuElementMouseOver.bind(this);
    this.titleMenuElementMouseOut = this.titleMenuElementMouseOut.bind(this);
    this.projectsMenuElementMouseOver = this.projectsMenuElementMouseOver.bind(this);
    this.projectsMenuElementMouseOut = this.projectsMenuElementMouseOut.bind(this);
    this.aboutMenuElementMouseOver = this.aboutMenuElementMouseOver.bind(this);
    this.aboutMenuElementMouseOut = this.aboutMenuElementMouseOut.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setProjects = this.setProjects.bind(this);
    this.setAbout = this.setAbout.bind(this);
  }

  titleMenuElementMouseOver() {
    var p = document.getElementById("title_menu_element").firstChild;
    p.classList.add("displayed");
  }

  titleMenuElementMouseOut() {
    var p = document.getElementById("title_menu_element").firstChild;
    p.classList.remove("displayed");
  }

  projectsMenuElementMouseOver() {
    var p = document.getElementById("projects_menu_element").firstChild;
    p.classList.add("displayed");
  }

  projectsMenuElementMouseOut() {
    var p = document.getElementById("projects_menu_element").firstChild;
    p.classList.remove("displayed");
  }

  aboutMenuElementMouseOver() {
    var p = document.getElementById("about_menu_element").firstChild;
    p.classList.add("displayed");
  }

  aboutMenuElementMouseOut() {
    var p = document.getElementById("about_menu_element").firstChild;
    p.classList.remove("displayed");
  }

  setTitle() {
    return this.setState({
      ...this.state,
      page: "title"
    });
  }

  setProjects() {
    return this.setState({
      ...this.state,
      page: "projects"
    });
  }

  setAbout() {
    return this.state = {
      ...this.state,
      page: "about"
    };
  }

  render() {
    var data = this.props;

    return (
      <React.Fragment>
        {this.state.page == "title" && <Title {...data}/>}
        {this.state.page == "projects" && <Projects {...data}/>}
        {this.state.page == "about" && <About {...data}/>}
        <Menu
          titleMenuElementMouseOver={this.titleMenuElementMouseOver}
          titleMenuElementMouseOut={this.titleMenuElementMouseOut}
          projectsMenuElementMouseOver={this.projectsMenuElementMouseOver}
          projectsMenuElementMouseOut={this.projectsMenuElementMouseOut}
          aboutMenuElementMouseOver={this.aboutMenuElementMouseOver}
          aboutMenuElementMouseOut={this.aboutMenuElementMouseOut}
          setTitle={this.setTitle}
          setProjects={this.setProjects}
          setAbout={this.setAbout}/>
      </React.Fragment>
    );
  }
}

module.exports = Content;