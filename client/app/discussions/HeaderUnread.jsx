'use strict';

var _ = require('underscore');
var React = require('react');
var urls = require('../urls');

var HeaderUnread = React.createClass({

  handleJumpToUnread: function(evt) {
    var url = evt.currentTarget.dataset.href;
    window.location.href = url;
    this.setState({
      'unreads': _.rest(this.state.unreads)
    });
    evt.preventDefault();
  },

  getInitialState: function() {
    return {
      'unreads': []
    }
  },

  componentWillMount: function() {
    this.setState({
      'unreads': this.props.unreads
    });
  },

  render: function () {
    var first = _.first(this.state.unreads);
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    var url;
    if (first) {
      kwargs.message_id = first.id;
      url = urls.get('discussion:detail:message', kwargs);
    }
    return (
      <span className="actions">
        {first ? <a data-href={url} className="unreads" onClick={this.handleJumpToUnread}>
          <span className="unreads-count">{this.state.unreads.length}</span>
        </a> : null}
      </span>
    );
  }
});

module.exports = HeaderUnread;
