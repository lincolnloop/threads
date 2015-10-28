'use strict';

var React = require('react');
var urls = require('../urls');
var classnames = require('classnames');
var GenericButton = require('../components/GenericButton.jsx');

var DiscussionIntro = React.createClass({

  render: function () {

    var url = urls.get('discussion:create:team', {'team_slug': this.props.team_slug});

    var viewClasses = classnames({
      'intro-view': true,
      'fade-in': true
    });

    return (
      <div className={viewClasses}>
        <span className='welcome-message'>
          <h1>Hello and welcome to {this.props.teamname} !</h1>
          <p>Lorem ipsum dolor sit</p>
        </span>
        <GenericButton url={url} />
      </div>
    );
  }
});

module.exports = DiscussionIntro;
