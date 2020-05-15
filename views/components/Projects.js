var React = require('react');

class Projects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: 1000,
      grabbing: false,
      translating: false,
      actualPosition: 0,
      categoryNumber: 0,
      xDown: null,                                                       
      yDown: null
    }
    this.onCategoryClick = this.onCategoryClick.bind(this);
    this.onDragMouseDown = this.onDragMouseDown.bind(this);
    this.onDragMouseMove = this.onDragMouseMove.bind(this);
    this.onDragMouseUp = this.onDragMouseUp.bind(this);
    this.leftArrowMouseOver = this.leftArrowMouseOver.bind(this);
    this.rightArrowMouseOver = this.rightArrowMouseOver.bind(this);
    this.leftArrowMouseOut = this.leftArrowMouseOut.bind(this);
    this.rightArrowMouseOut = this.rightArrowMouseOut.bind(this);
    this.wheel = this.wheel.bind(this);
    this.getPercent = this.getPercent.bind(this);
    this.updateScrollBar = this.updateScrollBar.bind(this);
    this.updateArrows = this.updateArrows.bind(this);
    this.updateActualPosition = this.updateActualPosition.bind(this);
    this.translateElement = this.translateElement.bind(this);
    this.updateCategoriesStatus = this.updateCategoriesStatus.bind(this);
    this.getTouches = this.getTouches.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  getTouches(ev) {
    return ev.touches || ev.originalEvent.touches;
  }                                                     

  handleTouchStart(ev) {
    const firstTouch = this.getTouches(ev)[0];                                      
    this.state.xDown = firstTouch.clientX;                                      
    this.state.yDown = firstTouch.clientY;                                      
  };                                                

  handleTouchMove(ev) {
    if (!this.state.xDown || !this.state.yDown) {
      return;
    }

    var xUp = ev.touches[0].clientX;                                    
    var yUp = ev.touches[0].clientY;

    var xDiff = this.state.xDown - xUp;
    var yDiff = this.state.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        if (this.state.actualPosition + 1 <= this.state.categoryNumber - 1 && !ev.currentTarget.classList.contains("inactive") && !this.state.translating) {
          this.state.translating = true;
          this.updateActualPosition(1);
        }
      } else {
        if (this.state.actualPosition - 1 >= 0 && !ev.currentTarget.classList.contains("inactive")  && !this.state.translating) {
          this.state.translating = true;
          this.updateActualPosition(0);
        }
      }                       
    }
    
    this.state.xDown = null;
    this.state.yDown = null;                                             
  };

  onCategoryClick(ev) {
    var pos = this.state.actualPosition;
    pos = ev.currentTarget.classList.contains("prev") ? pos-1 : pos;
    pos = ev.currentTarget.classList.contains("next") ? pos+1 : pos;
    this.props.displayProject(pos);
  }

  onDragMouseDown(ev) {
    ev.preventDefault();
    var grab_container = ev.currentTarget;
    var slider_bar = document.getElementById("slider_bar");
    grab_container.classList.add("grabbed");
    this.state.grabbing = true;
    var catagory_wrapper = document.getElementById("projects_category_wrapper");
    catagory_wrapper.style.transform = "scale(0.6)";
  }

  onDragMouseMove(ev) {
    ev.preventDefault();
    if (this.state.grabbing == true) {
      var grab_container = document.getElementById("grab_container");
      var slider_bar = document.getElementById("slider_bar");
      var grab_container_offsetX = (document.documentElement.clientWidth - grab_container.parentElement.clientWidth) / 2;
      var minTranslation = (1 * (grab_container.parentElement.clientWidth / (this.state.categoryNumber + 1))) - (grab_container.clientWidth / 2);
      var maxTranslation = (this.state.categoryNumber * (grab_container.parentElement.clientWidth / (this.state.categoryNumber + 1))) - (grab_container.clientWidth / 2);
      var xTranslationValue = ev.x - grab_container_offsetX - grab_container.clientWidth / 2;
      if (xTranslationValue > minTranslation && xTranslationValue < maxTranslation) {
        grab_container.style.transition = "all ease-out .2s, transform ease-out 0ms";
        grab_container.style.transform = "translateX("+xTranslationValue+"px)";

        var projects_container = document.getElementById("projects_container");
        const viewportW = document.documentElement.clientWidth;
        const elementW = projects_container.firstChild.firstChild.clientWidth;
        var max_projects_container_translation = (this.state.categoryNumber - 1) * (elementW + ((viewportW - elementW) / 2 - this.getPercent(8, viewportW)));
        var target_projects_container_trans = (xTranslationValue - minTranslation) * max_projects_container_translation / (maxTranslation - minTranslation);
        projects_container.style.transform = "translateX(" + -target_projects_container_trans + "px)";

        var actualSlidePos = Math.round(xTranslationValue / minTranslation) - 1;
        if (actualSlidePos != this.state.actualPosition) {
          this.state.actualPosition = actualSlidePos;
        }
      }
    }
  }

  onDragMouseUp(ev) {
    ev.preventDefault();
    if (this.state.grabbing == true) {
      var grab_container = document.getElementById("grab_container");
      var slider_bar = document.getElementById("slider_bar");
      grab_container.classList.remove("grabbed");
      this.state.grabbing = false;
      var catagory_wrapper = document.getElementById("projects_category_wrapper");
      catagory_wrapper.style.transform = "scale(1)";
      this.translateElement(true);
    }
  }

  leftArrowMouseOut() {
    if (document.getElementsByClassName("prev").length != 0)
      document.getElementsByClassName("prev")[0].classList.remove("hover");
  }

  rightArrowMouseOut() {
    if (document.getElementsByClassName("next").length != 0)
      document.getElementsByClassName("next")[0].classList.remove("hover");
  }

  leftArrowMouseOver() {
    if (document.getElementsByClassName("prev").length != 0)
      document.getElementsByClassName("prev")[0].classList.add("hover");
  }

  rightArrowMouseOver() {
    if (document.getElementsByClassName("next").length != 0)
      document.getElementsByClassName("next")[0].classList.add("hover");
  }

  leftArrowClick(ev) {
    ev.preventDefault();
    if (this.state.actualPosition - 1 >= 0 && !ev.currentTarget.classList.contains("inactive")  && !this.state.translating) {
      this.state.translating = true;
      this.updateActualPosition(0);
    }
  }

  rightArrowClick(ev) {
    ev.preventDefault();
    if (this.state.actualPosition + 1 <= this.state.categoryNumber - 1 && !ev.currentTarget.classList.contains("inactive")  && !this.state.translating) {
      this.state.translating = true;
      this.updateActualPosition(1);
    }
  }

  getPercent(percent, total) {
    return percent*total/100;
  }

  updateScrollBar(hasTransitionDuration) {
    var grab_container = document.getElementById("grab_container");
    var toTranslate = ((this.state.actualPosition + 1) * (grab_container.parentElement.clientWidth / (this.state.categoryNumber + 1))) - (grab_container.clientWidth / 2);
    if (hasTransitionDuration) {
      grab_container.style.transition = "all ease-out .2s, transform ease-out " + this.state.duration+"ms";
    } else {
      grab_container.style.transition = "all ease-out .2s, transform ease-out 0ms";
    }
    grab_container.style.transform = "translateX("+toTranslate+"px)";
  }

  updateArrows() {
    const leftArrow = document.getElementById("projects_left_arrow");
    const rightArrow = document.getElementById("projects_right_arrow");
    if (this.state.actualPosition == 0) {
      leftArrow.classList.add("inactive");
      if (this.state.categoryNumber > 1) {
        rightArrow.classList.remove("inactive");
      }
    } else if (this.state.actualPosition == this.state.categoryNumber - 1) {
      if (this.state.categoryNumber > 1) {
        leftArrow.classList.remove("inactive");
      }
      rightArrow.classList.add("inactive");
    } else {
      leftArrow.classList.remove("inactive");
      rightArrow.classList.remove("inactive");
    }
  }

  updateCategoriesStatus(projects_container) {
    for (var i = 0; i < projects_container.children.length; i++) {
      var pos = this.state.actualPosition;
      projects_container.children[i].classList.remove("prev")
      projects_container.children[i].classList.remove("next")
      if (i == pos - 1)
      projects_container.children[i].classList.add("prev")
      if (i == pos + 1)
      projects_container.children[i].classList.add("next")
    }
  }

  updateActualPosition(translationStatus) {
    switch (translationStatus) {
      case 0:
        this.state.actualPosition -= 1;
        break;
      case 1:
        this.state.actualPosition += 1;
        break;
      default:
        break;
    }
    this.translateElement(true);
  }

  translateElement(hasPositionChanged) {
    var projects_container = document.getElementById("projects_container");
    if (hasPositionChanged) {
      projects_container.style.transitionDuration = this.state.duration+"ms";
        this.updateCategoriesStatus(projects_container);
    }
    const viewportW = document.documentElement.clientWidth;
    const elementW = projects_container.firstChild.firstChild.clientWidth;
    const targetTrans = this.state.actualPosition * (elementW + ((viewportW - elementW) / 2 - this.getPercent(8, viewportW))); // 8 percent of the vieport because it's the marge I took in css : 8vw
    projects_container.style.transform = "translateX(" + -targetTrans + "px)";
    this.updateArrows();
    this.updateScrollBar(true);
    setTimeout(() => {
      projects_container.style.transitionDuration = "0ms";
      this.state.translating = false;
    }, this.state.duration);
  }

  wheel(ev) {
    if (ev.deltaY > 0) {
      if (this.state.actualPosition + 1 <= this.state.categoryNumber - 1 && !this.state.translating) {
        this.state.translating = true;
        this.updateActualPosition(1);
      }
    } else {
      if (this.state.actualPosition - 1 >= 0 && !this.state.translating) {
        this.state.translating = true;
        this.updateActualPosition(0);
      }
    }
  }

  componentDidMount() {
    var projects_container = document.getElementById("projects_container");
    window.addEventListener('resize', (e) => {if (projects_container != undefined) this.translateElement(false)}, true);
    window.addEventListener('mouseup', (e) => {this.onDragMouseUp(e)}, true);
    window.addEventListener('mousemove', (e) => {this.onDragMouseMove(e)}, true);
    this.updateScrollBar(false);
  }

  render() {
    var data = this.props;
    var projectsCategories = [];
    for (const key of Object.keys(data.categories)) {
      var divStyle = {
        backgroundColor: "black"
      }
      if (data.categories[key].elements["1"] != undefined && data.categories[key].elements["1"].main_image != undefined) {
        divStyle = {
          backgroundImage: "url(" + data.categories[key].elements["1"].main_image + ")"
        }
      } else if (data.categories[key].elements["1"] != undefined && data.categories[key].elements["1"].images["1"] != undefined) {
        divStyle = {
          backgroundImage: "url(" + data.categories[key].elements["1"].images["1"] + ")"
        }
      }
      var element = 
      <div onClick={(e) => {this.onCategoryClick(e)}} key={"category"+key} className={(Object.keys(data.categories).indexOf(key) == 1) ? "project_category disable_lightspeed next": "project_category disable_lightspeed"}>
        <div style={divStyle} className="category_background disable_lightspeed"></div>
        <div className="category_text_container disable_lightspeed">
          <p className="disable_select disable_lightspeed">{data.categories[key].name}</p>
        </div>
      </div>;
      projectsCategories.push(element);
      // this.state.anchors.push(Object.keys(data.categories).indexOf(key));
      this.state.categoryNumber += 1;
    }
    return (
      <React.Fragment>
          <h3 className="page_title disable_select">{data.page_title_outline}<strong>{data.page_title_strong}</strong></h3>
          <div id="projects_category_wrapper">
            <div id="projects_category_wrapper2">
              <div id="projects_container" onTouchMove={(e) => {this.handleTouchMove(e)}} onTouchStart={(e) => {this.handleTouchStart(e)}} onWheel = {(e) => this.wheel(e)}>
                {projectsCategories}
              </div>
            </div>
          </div>
          <div id="projects_slider_container">
            <span id="slider_bar"></span>
            <div id="grab_container" onMouseDown={(e) => this.onDragMouseDown(e)} className="disable_lightspeed">
              <div className="before"><i className="fas fa-chevron-up disable_lightspeed"></i></div>
              <span id="grab_dot" className="disable_lightspeed"></span>
              <div className="after"><i className="fas fa-chevron-down disable_lightspeed"></i></div>
            </div>
          </div>
          <div id="projects_left_arrow" className="arrow inactive disable_lightspeed" onMouseOut={this.leftArrowMouseOut} onMouseOver={this.leftArrowMouseOver} onClick={(e) => this.leftArrowClick(e)}>
            <i className="fas fa-chevron-left disable_lightspeed"></i>
          </div>
          <div id="projects_right_arrow" className="arrow disable_lightspeed" onMouseOut={this.rightArrowMouseOut} onMouseOver={this.rightArrowMouseOver} onClick={(e) => this.rightArrowClick(e)}>
            <i className="fas fa-chevron-right disable_lightspeed"></i>
          </div>
      </React.Fragment>
    );
  }
}

module.exports = Projects;