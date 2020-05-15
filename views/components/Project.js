var React = require('react');

class Project extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			elementsNumber: 0,
			projectNumber: 0
		}
		this.onKeyDown = this.onKeyDown.bind(this);
		this.backClick = this.backClick.bind(this);
		this.leftArrowClick = this.leftArrowClick.bind(this);
		this.rightArrowClick = this.rightArrowClick.bind(this);
	}

	onKeyDown(ev) {
		ev = ev || window.event;
		if (ev.keyCode == 27) {
			this.backClick(ev);
		}
	}
	
	leftArrowClick(ev) {
		var prevProjectNumber = 0;
		if (this.state.projectNumber == 1) {
			prevProjectNumber = this.state.elementsNumber;
		} else {
			prevProjectNumber = this.state.projectNumber - 1;
		}
		this.setState({
			...this.state,
			projectNumber: prevProjectNumber
		});
		var project_container = document.getElementById("project_container");
		project_container.scrollTop = 0;
	}

	rightArrowClick(ev) {
		var nextProjectNumber = 0;
		if (this.state.projectNumber == this.state.elementsNumber) {
			nextProjectNumber = 1;
		} else {
			nextProjectNumber = this.state.projectNumber + 1;
		}
		this.setState({
			...this.state,
			projectNumber: nextProjectNumber
		});
		var project_container = document.getElementById("project_container");
		project_container.scrollTop = 0;
	}

  backClick(ev) {
	var project_container = document.getElementById("project_container");
	if (project_container) {
		project_container.classList.remove("displayed");
		setTimeout(() => {
			this.props.closeProject();
		}, 200);
	}
  }

  componentDidMount() {
	document.onkeydown = (e) => {this.onKeyDown(e)};
    var project_container = document.getElementById("project_container");
    setTimeout(() => {
      project_container.classList.add("displayed");
    }, 10);
  }

  render() {
    var data = this.props;
	var category = data.categories[Object.keys(data.categories)[data.category]];
	this.state.elementsNumber = Object.keys(category.elements).length;
	var project = {}
	if (this.state.projectNumber == 0) { // If not set until now then start from 1
		this.state.projectNumber = 1;
	}
    if (category.elements[this.state.projectNumber.toString()] != undefined) {
      project = category.elements[this.state.projectNumber.toString()];
    }

    var videos = []
    var texts = []
    var images = []

    if (project.videos != undefined) {
      for (const key of Object.keys(project.videos)) {
        videos.push(<iframe className="disable_lightspeed project_video" key={"video"+key} src={project.videos[key]} frameBorder="0" allowFullScreen></iframe>);
      }
    }

    if (project.desc != undefined) {
      for (const key of Object.keys(project.desc)) {
        if (Object.keys(project.desc).indexOf(key) != Object.keys(project.desc).length - 1) {
			texts.push(<React.Fragment key={"desc"+key}>{project.desc[key]}<br/><br/></React.Fragment>);
        } else {
			texts.push(<React.Fragment key={"desc"+key}>{project.desc[key]}</React.Fragment>);
        }
      }
    }

    if (project.images != undefined) {
      for (const key of Object.keys(project.images)) {
        images.push(<div key={"image"+key} className="project_image disable_lightspeed" style={{backgroundImage: "url(" + project.images[key] + ")"}}></div>)
      }
	}
	
	var project_number = <p id="project_number" className="disable_lightspeed">{this.state.projectNumber}/{this.state.elementsNumber}</p>

    return (
		<React.Fragment>
			<div id="project_container" className="disable_lightspeed">
				<div id="upper_left">
					<div id="project_back" className="disable_lightspeed" onClick={(e) => {this.backClick(e)}}>
						<i className="fas fa-chevron-left disable_lightspeed"></i>
						<p className="disable_lightspeed">{data.back}</p>
					</div>
					<div id="project_icons" className="disable_lightspeed">
						{project.git != undefined && <a href={project.git} target="_blank" className="disable_lightspeed"><i className="fab fa-github"></i></a>}
						{project.website != undefined && <a href={project.website} target="_blank" className="disable_lightspeed"><i className="fas fa-desktop"></i></a>}
					</div>
				</div>
				<div id="upper_right" className="disable_lightspeed">
					<div id="upper_right_main">
						{project_number}
						<h2 className="disable_lightspeed">{project.name}</h2>
					</div>
					<p className="disable_lightspeed">{project.tools}</p>
				</div>
				<div id="project_main_content" className="disable_lightspeed">
					{videos}
					{project.main_image != undefined && <div className="project_image disable_lightspeed" style={{backgroundImage: "url(" + project.main_image + ")"}}></div>}
					<p id="project_text" className="text disable_lightspeed">
						{texts}
					</p>
					{images}
				</div>
				
				{this.state.elementsNumber > 1 && 
				<div id="project_left_arrow" className="arrow disable_lightspeed" onClick={(e) => this.leftArrowClick(e)}>
					<i className="fas fa-chevron-left disable_lightspeed"></i>
				</div>}
				{this.state.elementsNumber > 1 &&
				<div id="project_right_arrow" className="arrow disable_lightspeed" onClick={(e) => this.rightArrowClick(e)}>
					<i className="fas fa-chevron-right disable_lightspeed"></i>
				</div>}
			</div>
		</React.Fragment>
    );
  }
}

module.exports = Project;