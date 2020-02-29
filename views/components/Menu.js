var React = require('react');

class Menu extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div id="menu">
            <div id="title_menu_element" className="menu_element selected">
                <p>Accueil</p>
                <div
                    onMouseOver={this.props.titleMenuElementMouseOver}
                    onMouseOut={this.props.titleMenuElementMouseOut}
                    onClick={this.props.setTitle}
                    id="menu_1"
                    className="menu_icon">
                </div>
            </div>
            <div id="projects_menu_element" className="menu_element">
                <p>Projets</p>
                <div
                    onMouseOver={this.props.projectsMenuElementMouseOver}
                    onMouseOut={this.props.projectsMenuElementMouseOut}
                    onClick={this.props.setProjects}
                    id="menu_2"
                    className="menu_icon">
                </div>
            </div>
            <div id="about_menu_element" className="menu_element">
                <p>Contact</p>
                <div
                    onMouseOver={this.props.aboutMenuElementMouseOver}
                    onMouseOut={this.props.aboutMenuElementMouseOut}
                    onClick={this.props.setAbout}
                    id="menu_3"
                    className="menu_icon">
                </div>
            </div>
        </div>
        );
    }
}

module.exports = Menu;