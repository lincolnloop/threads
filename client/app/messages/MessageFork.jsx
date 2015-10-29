'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var MarkdownView = require('../components/MarkdownTextarea.jsx');
var shortcuts = require('../utils/shortcuts');

var MessageForkView = React.createClass({

  handleSubmit: function(evt) {
    evt.preventDefault();
    var data = {
      'title': this.refs.title.value,
    };
    store._post(this.props.parent_url + 'fork/', data).then(function(message) { // PUT -- POST
      log.info('MessageFork:success');
      // redirect
      var kwargs = shortcuts.getURIArgs();
      delete kwargs.message_id
      kwargs['discussion_id'] = urls.resolve(JSON.parse(message).url).kwargs.discussion_id
      var url = urls.get('discussion:detail', kwargs);
      app.history.navigate(url, {'trigger': true});
    }.bind(this));
    return false;
  },

  render: function() {
    var team = shortcuts.getActiveTeam();
    var message = shortcuts.getActiveMessage();
    var author = message ? store.find('users', message.user) : null;
    return (
      <div className="message-fork content-view">
        <form className="form-view" onSubmit={this.handleSubmit}>
          <div className="form-view-actions">
            <div className="form-view-fields">
              <input type="text"
                     ref="title"
                     placeholder="New Title"/>
            </div>
          </div>

          {message ? <div className="message">

            <div className="message-container" onClick={this.toggleExpand}>

            <div className="message-header">
              <div className="avatar">
                <img src={gravatar.get(author.email)} />
              </div>
              <div className="username">{author.name}</div>
              <div className="date">
                <a href="/lincoln-loop/12461/potential-project-united-nations-world-food-programme-wfp/#89624" 
                   className="permalink">
                  <time className="timeago" datetime="2014-02-06T22:02:23.791">{moment(message.date_created).fromNow()}</time>
                </a>
              </div>
            </div>
            </div>
          </div> : null}
          <button type="submit" className="btn btn-submit">Fork</button>
        </form>
      </div>
    );
  }
});

module.exports = MessageForkView;
