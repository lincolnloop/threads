'use strict';

var React = require('react');
var _ = require('underscore');
var urls = require('../urls');
var classnames = require('classnames');
var GenericButton = require('../components/GenericButton.jsx');
var shortcuts = require('../utils/shortcuts');
var gravatar = require('../utils/gravatar');
var User = require('../user/User.jsx');

var DiscussionIntro = React.createClass({

  render: function () {
    var url = urls.get('discussion:create:team', {'team_slug': this.props.team_slug});
    var user = store.find('users', localStorage.getItem('user'));

    var viewClasses = classnames({
      'intro-view': true,
      'fade-in': true
    });

    var members = _.map(shortcuts.getActiveTeam().members, function(member) {
      return store.find('users', member.user);
    });

    return (
      <div className={viewClasses}>
        <div className="users">
          {_.map(members, function(member) {
            return <User userId={member.id} name={member.name} email={member.email} />
          })}
        </div>
        <span className='welcome-message'>
          <h2 className='salutation'>Hi {user.name}</h2>
          <h3>and welcome to {this.props.team.name} !</h3>
          <p>{this.props.team.description}</p>
        </span>
        <GenericButton url={url} />
      </div>
    );
  }
});

module.exports = DiscussionIntro;
