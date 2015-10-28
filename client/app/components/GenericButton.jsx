'use strict';

var React = require('react');
var app = require('../AppRouter');

var GenericButton = React.createClass({

  getInitialState: function () {
    return {
      'hover': false,
      'x': 0,
      'y': 0
    }
  },

  render: function () {

    var btnStyles = {
      'position': 'relative',
      'width': '40px',
      'height': '40px',
      'cursor': 'pointer'
    }

    var pulseStyles = {
      'position': 'absolute',
      'display': 'block',
      'backgroundColor':  '#d1d1d1',
      'borderRadius': '30px',
      'height': '60px',
      'width': '60px',
      'animation': this.state.hover === true ? 'pulsate 1.5s ease-out infinite' : 'true',
      'animationIterationCount': 'infinite',
      'opacity': '0.0'
    }

    var contentStyles = {
      'position': 'absolute',
      'display': 'block',
      'top': '5px',
      'left': '5px',
      'height': '50px',
      'width': '50px',
      'padding': '10px',
      'lineHeight': '30px',
      'textAlign': 'center',
      'borderRadius': '30px',
      'backgroundColor':  this.state.hover === true ? '#b1b1b1' : '#6c6c6c',
      'transition': 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
      'color': '#000'
    }

    var hintStyles = {
      'position': 'absolute',
      'display': 'none',
      'top': this.state.y +100,
      'left': this.state.x - 530
    }

    return (
      <div>
        <div className='hint' style={hintStyles}><h3>Create a new Discussion</h3><svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 167.3 91.3" ><path className="st0" d="M154.9,48.9c0,0,0-0.1,0-0.1c0-1.8-0.7-3.6-2.2-4.8c-0.7-0.6-4.7-3.5-9.9-6.6c-1.3-0.8-2.6-1.6-4-2.5 c-0.3-0.2-0.7-0.4-1-0.7l-0.3-0.2l-0.1-0.1l0,0c0.3,0.2,0.1,0.1,0.1,0.1l0,0l-0.1,0l-0.5-0.4c-0.7-0.5-1.5-1-2.2-1.6 c-3-2.1-6.1-4.4-9.1-6.7c-6.1-4.6-12-9.2-16.3-12.8c-4.4-3.5-7.4-5.9-8.2-5.3c-0.8,0.6,0.8,4.2,4,9.1c3.2,4.9,8.3,10.9,13.7,16.6 c1.1,1.1,2.2,2.2,3.2,3.3C98.8,37.3,11.5,42.7,11.6,48.5c0,5.7,82.7,9.9,108.6,10.9c-1,0.7-2.1,1.5-3.1,2.2 c-6.4,4.6-12.4,9.7-16.5,13.9c-4.1,4.2-6.3,7.5-5.6,8.2c0.7,0.8,4.1-1.1,9-3.8c4.9-2.7,11.5-6.3,18.4-9.7c3.4-1.7,6.9-3.4,10.2-4.9 c0.8-0.4,1.6-0.8,2.4-1.2l0.6-0.3l0.1,0l0,0c0,0,0.1,0-0.1,0.1l0,0l0.1-0.1l0.3-0.1c0.4-0.2,0.7-0.3,1.1-0.5c1.5-0.6,3-1.2,4.4-1.7 c5.7-2.1,10.2-4.2,11-4.7c1.6-0.9,2.7-2.6,3-4.4C155.6,51.3,155.4,50.1,154.9,48.9z" fill="#6c6c6c"/></svg></div>
        <div className='btn-wrapper'
             style={btnStyles}
             onClick={this.gotURL}
             onMouseOver={this.handleMouseOver}
             onMouseOut={this.handleMouseOut}
             ref="addButton" >
          <span className='btn-pulse' style={pulseStyles}></span>
          <div className='btn-content' style={contentStyles}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><polygon fill-rule="evenodd" clip-rule="evenodd" points="17,13 17,2 13,2 13,13 2,13 2,17 13,17 13,28 17,28 17,17 28,17 28,13 " fill="#ffffff"/></svg></div>
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    // this.setState({
    //   'x': this.refs.addButton.getDOMNode().offsetTop,
    //   'y': this.refs.addButton.getDOMNode().offsetLeft
    // });
  },
  gotURL: function() {
    app.history.navigate(this.props.url, {'trigger': true});
  },
  handleMouseOver: function() {
    this.setState({ 'hover': true });
  },
  handleMouseOut: function() {
    this.setState({ 'hover': false });
  }
});

module.exports = GenericButton;
