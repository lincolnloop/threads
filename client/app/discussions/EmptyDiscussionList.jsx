'use strict';

var _ = require('underscore');
var React = require('react');
var urls = require('../urls');

var EmptyDiscussionListView = React.createClass({
  render: function() {
    return (
      <div className="empty-list">
        <h4>There are no discussions on this team yet!</h4>
        <p>
          <a href={urls.get('discussion:create:team', {'team_slug': this.props.teamSlug})}>
            Create your first discussion
          </a>
        </p>
      </div>
    );
  }
});

module.exports = EmptyDiscussionListView;
