'use strict';

var React = require('react');
var urls = require('../urls');
var classnames = require('classnames');

var DiscussionIntro = React.createClass({

  render: function () {

    var viewClasses = classnames({
      'intro-view': true,
      'fade-in': true
    });

    var viewStyle = {
      'height': '100%',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'textAlign': 'center'
    }

    return (
      <div className={viewClasses} style={viewStyle}>
        <span>
          <h1>Hello and welcome to {this.props.teamname} !</h1>
          <p>Lorem ipsum dolor sit</p>
        </span>
      </div>
    );
  }
});

module.exports = DiscussionIntro;
