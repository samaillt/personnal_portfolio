var React = require('react');

class MenuBurger extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var data = this.props;
        return (
        <div id="menu_burger" className="disable_lightspeed" onClick={data.onBurgerMenuClick}>
            <span id="burger_top" className="disable_lightspeed"></span>
            <span id="burger_middle" className="disable_lightspeed"></span>
            <span id="burger_bottom" className="disable_lightspeed"></span>
        </div>
        );
    }
}

module.exports = MenuBurger;