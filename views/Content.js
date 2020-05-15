var React = require('react');
var Home = require('./components/Home');
var Projects = require('./components/Projects');
var Project = require('./components/Project');
var About = require('./components/About');
var MenuBurger = require('./components/MenuBurger');
var Menu = require('./components/Menu');

class Content extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCategory: 0,
      is_project_open: false,
      page: "home",
      is_menu_open: false
    }
    this.displayProject = this.displayProject.bind(this);
    this.closeProject = this.closeProject.bind(this);
    this.setHome = this.setHome.bind(this);
    this.setProjects = this.setProjects.bind(this);
    this.setAbout = this.setAbout.bind(this);
    this.onBurgerMenuClick = this.onBurgerMenuClick.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.updateMenuElements = this.updateMenuElements.bind(this);
  }

  displayProject(categoryNumber) {
    this.setState({
      ...this.state,
      is_project_open: true,
      currentCategory: categoryNumber
    });
  }

  closeProject() {
    this.setState({
      ...this.state,
      is_project_open: false,
      currentCategory: 0
    });
  }

  setHome() {
    window.location.href = this.props.lang == "fr" ? '/home' : '/en/home';
    //this.closeMenu();
    this.setState({
      ...this.state,
      page: "home"
    });
    // setTimeout(() => {this.updateMenuElements("home")}, 300);
  }

  setProjects() {
    window.location.href = this.props.lang == "fr" ? '/projects' : '/en/projects';
    //this.closeMenu();
    this.setState({
      ...this.state,
      page: "projects"
    });
    // setTimeout(() => {this.updateMenuElements("projects")}, 300);
  }

  setAbout() {
    window.location.href = this.props.lang == "fr" ? '/about' : '/en/about';
    //this.closeMenu();
    this.setState({
      ...this.state,
      page: "about"
    });
    // setTimeout(() => {this.updateMenuElements("about")}, 300);
  }
  
  onBurgerMenuClick() {
    if (this.state.is_menu_open) {
        this.closeMenu();
    } else {
        this.openMenu();
    }
  }

  openMenu() {
    var menu = document.getElementById("menu");
    menu.classList.remove("closed");
    menu.classList.add("opened");
    var menu_burger = document.getElementById("menu_burger");
    menu_burger.classList.add("clicked");
    this.state.is_menu_open = true;
  }

  closeMenu() {
    var menu = document.getElementById("menu");
    menu.classList.remove("opened");
    menu.classList.add("closed");
    var menu_burger = document.getElementById("menu_burger");
    menu_burger.classList.remove("clicked");
    this.state.is_menu_open = false;
  }

  updateMenuElements(active) {
    var home_element = document.getElementById("menu_element_home");
    var projects_element = document.getElementById("menu_element_projects");
    var about_element = document.getElementById("menu_element_about");
    if (active == "home") {
      home_element.classList.add("active");
      projects_element.classList.remove("active");
      about_element.classList.remove("active");
    } else if (active == "projects") {
      home_element.classList.remove("active");
      projects_element.classList.add("active");
      about_element.classList.remove("active");
    } else if (active == "about") {
      home_element.classList.remove("active");
      projects_element.classList.remove("active");
      about_element.classList.add("active");
    } else {
      home_element.classList.remove("active");
      projects_element.classList.remove("active");
      about_element.classList.remove("active");
    }
  }

  componentDidMount() {
    this.updateMenuElements(this.props.page);
  }

  render() {
    var data = this.props;

    return (
      <React.Fragment>
        {data.page == "home" && <Home {...data.pages.home} lang = {this.props.lang}/>}
        {
          data.page == "projects" && !this.state.is_project_open && <Projects 
            {...data.pages.projects}
            displayProject = {this.displayProject}
          />
        }
        {
          this.state.is_project_open && <Project 
            {...data.pages.projects}
            closeProject = {this.closeProject}
            category = {this.state.currentCategory}
          />
        }
        {data.page == "about" && <About {...data.pages.about}/>}
        <MenuBurger 
          {...data}
          onBurgerMenuClick = {this.onBurgerMenuClick}
        />
        <Menu
          {...data}
          setHome = {this.setHome}
          setProjects = {this.setProjects}
          setAbout = {this.setAbout}
          lang = {this.props.lang}
          page = {data.page}
        />
      </React.Fragment>
    );
  }
}

module.exports = Content;