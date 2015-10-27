'use strict';

var React = require('react');
var urls = require('../urls');
var classnames = require('classnames');

var DiscussionIntro = React.createClass({

  render: function () {

    var url = urls.get('discussion:create:team', {'team_slug': this.props.team_slug});

    var viewClasses = classnames({
      'intro-view': true,
      'fade-in': true
    });

    var viewStyle = {
      'height': '100%',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'textAlign': 'center',
      'padding': '50px'
    }

    return (
      <div className={viewClasses} style={viewStyle}>
        <span>
          <h1>Hello and welcome to {this.props.teamname} !</h1>
          <p>Lorem ipsum dolor sit</p>
        </span>
        <a href={url} className="create-btn">create discussion</a>
      </div>
    );
  }
});

module.exports = DiscussionIntro;
