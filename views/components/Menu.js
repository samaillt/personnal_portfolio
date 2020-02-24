var React = require('react');

class Menu extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div id="menu">
            <div onClick={this.props.setTitle} id="menu_1" className="menu_element selected"></div>
            <div onClick={this.props.setProjects} id="menu_2" className="menu_element"></div>
            <div onClick={this.props.setAbout} id="menu_3" className="menu_element"></div>
        </div>
        );
    }
}

module.exports = Menu;