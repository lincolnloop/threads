'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var MarkdownView = require('../components/MarkdownTextarea.jsx');

var MessageForkView = React.createClass({

  handleSubmit: function(evt) {
    evt.preventDefault();
    var data = {
      //'': 'overrideUrl',
      //'url': ,
      'title': 'test',
      //'user': localStorage.getItem('user')
    };
    log.info(data);
    store._post(this.props.parent_url + 'fork/', data).then(function(message) { // PUT -- POST
      log.info('MessageFork:success');
      // redirect
      //var kwargs = urls.resolve(window.location.pathname).kwargs;
      //var url = urls.get('discussion:detail:message', _.extend(kwargs, {'message_id': message.id}));
      //app.history.navigate(url, {'trigger': true});
      log.info(message);
    }.bind(this));
    return false;
  },

  render: function() {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    var team = store.find('teams', {'slug': kwargs.team_slug});
    var message = store.find('messages', {'id': parseInt(kwargs.message_id)});
    var author = message ? store.find('users', message.user) : null;
    return (
      <div className="message-fork content-view">
        <form className="form-view" onSubmit={this.handleSubmit}>
          <div className="form-view-actions">
            <div className="form-view-fields">
              <input type="text"
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
