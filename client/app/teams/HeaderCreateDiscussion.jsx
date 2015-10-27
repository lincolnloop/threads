'use strict';

var React = require('react');
var urls = require('../urls');

var HeaderCreateDiscussion = React.createClass({

  render: function () {
    var url = urls.get('discussion:create:team', {'team_slug': this.props.team_slug});
    return (
      <span className="actions">
        <a href={url} className="create">create discussion</a>
      </span>
    );
  }
});

module.exports = HeaderCreateDiscussion;
