var React = require('react');

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var data = this.props;
        var menuEntries = [];
        for (const key of Object.keys(data.pages)) {
            var setFunction = null;
            var entry = key;
            var entryName = data.pages[key].name;
            if (entry == "home") {
                setFunction = data.setHome;
            } else if (entry == "projects") {
                setFunction = data.setProjects;
            } else if (entry == "about") {
                setFunction = data.setAbout;
            }
            var element = <p id={"menu_element_"+key} onClick={setFunction} key={key} className={(entry == "home") ? "menu_element active disable_select disable_lightspeed" : "menu_element disable_select disable_lightspeed"}>{entryName}</p>
            menuEntries.push(element);
        }
        return (
        <div id="menu">
            <div id="language_selection" className="disable_select disable_lightspeed">{(data.lang == "fr" ? <p className="current_lang disable_select disable_lightspeed">FR</p>:<a href={"/"+data.page} className="select_lang disable_select disable_lightspeed"><span className="disable_select disable_lightspeed" data-letters="FR">FR</span></a>)}/{(data.lang == "en" ? <p className="current_lang disable_select disable_lightspeed">EN</p>:<a href={"/en/"+data.page} className="select_lang disable_select disable_lightspeed"><span className="disable_select disable_lightspeed" data-letters="EN">EN</span></a>)}</div>
            {menuEntries}
            <div id="menu_footer">
                <div id="menu_icons">
                    <a href="https://github.com/samaillt" target="_blank"><i className="fab fa-github"></i></a>        
                    <a href="https://www.youtube.com/channel/UCtLCj7g000uBapYeMFK7kHQ/videos" target="_blank"><i className="fab fa-youtube"></i></a>
                    <a href="https://fr.linkedin.com/in/tom-samaille/" target="_blank"><i className="fab fa-linkedin"></i></a>
                    <a href="https://www.instagram.com/tom_samaille/" target="_blank"><i className="fab fa-instagram"></i></a>
                    <a href="https://www.behance.net/tomsamaille" target="_blank"><i className="fab fa-behance"></i></a>
                </div>
                <p id="menu_copyright">{data.pages.about.copyright}</p>
            </div>
        </div>
        );
    }
}

module.exports = Menu;