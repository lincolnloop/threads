'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var store = require('../../store');
var gravatar = require('../../utils/gravatar');
var MessageEditView = require('./edit');
var MessageContentView = require('./content');
var urls = require('../../urls');
var clientconfig = require('clientconfig');

require('react/addons');

var MessageDetailView = React.createClass({
  changeState: function (key, value) {
    // callback helper for `editing` state changes
    // usage:
    // _.partial(this.changeState, '<editing>', true|false)
    var state = {};
    state[key] = value;
    this.setState(state);
  },
  update: function() {
    var data = {
      'url': this.props.message,
      'raw_body': this.refs.message.refs.comment.getRawValue()
    }
    store.update('messages', data).then(function() {
      this.setState({'editing': false})
    }.bind(this));
    return false;
  },
  handleVote: function(value) {
    // find if user already has a vote
    var vote = store.find('votes', this.state.message.votes, function(vote) {
      return vote.user == localStorage.getItem('user');
    });
    if (!vote) {
      // create a new vote
      vote = {
        'message': this.state.message,
        'value': '+1'
      }
      // TODO: Crossing should return a full url for some url groups
      var url = clientconfig.apiUrl + urls.get('api:vote', {'message_id': this.state.message.id});
      store.add('votes', vote, {'url': url});
    } else {
      if (vote.value === value ) {
        store.remove('votes', vote);
      } else {
        // update current vote
      }
    }
  },
  getInitialState: function () {
    return {
      'editing': false
    };
  },
  render: function () {
    // shortcuts
    var message = this.props.message;
    var user = store.find('users', message.user);
    var div = React.DOM.div;
    // Get the correct MessageView based on `editing` state
    var MessageView = this.state.editing ? MessageEditView : MessageContentView;
    // main message classes
    var classes = React.addons.classSet({
      'message-detail': true,
      'message-unread': !message.read,
      'message-collapsed': message.collapsed
    });
    var avatar = gravatar.get(user.email);
    return (
      div({'className': 'message-container'},
        div({'className': classes},
          div({'className': 'avatar'},
            React.DOM.img({'src': avatar})
          ),
          div({'className': 'username', 'children': user.name}),
          div({'className': 'date', 'children': message.date_created}),
          MessageView({
            'ref': 'message',
            'message': message,
            // TODO: we only need the discussion here because of votes
            // and that should not rely on the discussion at all
            'discussion': this.props.discussion,
            'handleEditClick': _.partial(this.changeState, 'editing', true),
            // TODO: consider moving this outside of the message.
            // Replies are part of the MessageTree component, not the Message.
            'handleReplyClick': this.props.handleReplyClick,
            'handleEditSubmit': this.update,
            'handleEditCancelClick': _.partial(this.changeState, 'editing', false),
            // voting
            'handleVote': this.handleVote,
          })
        )
      )
    );
  }
});

module.exports = MessageDetailView;
