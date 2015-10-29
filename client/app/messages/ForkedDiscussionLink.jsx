'use strict';

var log = require('loglevel');
var React = require('react');
var store = require('../store');
var urls = require('../urls');

var ForkedDiscussionLink = React.createClass({

  getInitialState: function() {
    return {
      'discussion': null,
      'message': null,
    }
  },

  componentWillMount: function() {
    this.setState({'message': store.find('messages', this.props.parent)});
  },

  render: function() {
    var discussion = this.state.discussion;
    var team = discussion ? store.find('teams', discussion.team) : null;
    var url = discussion ? urls.get('discussion:detail', team.slug, discussion.id, discussion.slug) : null;
    return (
      <div className="forked-link">
        {this.state.discussion ? <span><span>Forked from: </span><a href={url}>
          {this.state.discussion.title}
        </a></span> : null}
      </div>
    );
  },

  componentDidMount: function() {
    store.get('messages', {}, {'url': this.props.parent}).then(function() {
      var message = store.find('messages', this.props.parent);
      return store.get('discussions', {}, {'url': message.discussion});
    }.bind(this)).done(function() {
      var message = store.find('messages', this.props.parent);
      var discussion = store.find('discussions', message.discussion);
      this.setState({
        'message': message,
        'discussion': discussion
      });
    }.bind(this));
  }

});

module.exports = ForkedDiscussionLink;
