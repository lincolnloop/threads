'use strict';

var React = require('react');
var log = require('loglevel');
var urls = require('../../urls');
var store = require('../../store');
var DiscussionListView = require('../../discussions/views/list');

// TODO: Shim or fork inViewport to this is supported
require('in-viewport');


var TeamDetail = React.createClass({

  render: function() {
    var team = this.props.team;
    var createDiscussionUrl;
    // get create discussion url
    // TODO: figure out a better, maybe one-liner, API
    createDiscussionUrl = '/' + urls.get('discussion:create:team', {
      team_slug: team.slug
    });
    return (
      <div className="team-detail">
        <h2>{team.name}</h2>
        <a className="button btn-create-discussion" href={createDiscussionUrl}>New Discussion</a>
          <DiscussionListView discussions={this.state.discussions} ref="discussions" />
      </div>
    );
  },

  getDiscussions: function() {
    // Gets discussion data from our in-memory storage
    // and updates the component state.
    this.setState({
      discussions: this.team.discussions.serialized()
    });
  },

  fetchDiscussions: function() {
    // Fetches discussion data from the remote API
    // and updates the component state.
    if (this.team.discussions.fetched) {
      // Do nothing if the initial discussions were already fetched
      // NOTE: This only works if we have realtime updates (!)
      return false;
    }
    this.team.discussions.fetch({
      remove: false,
      success: function (collection, response) {
        this.setState({
          discussions: response.results
        });
      }.bind(this)
    });
  },

  fetchDiscussionsPagination: function() {
    // fetch paginated discussions from the remote API
    // and update component state
    var limit = 5;
    // figure out scroll position in relation to the last item on the list
    if (!this.team.discussions.meta.next) {
      // if there is no next discussions page, do nothing
      return;
    }
    this.team.discussions.fetch({
      remove: false,
      data: {
        'page': this.team.discussions.meta.next,
        'limit': limit
      },
      success: function (collection) {
        log.debug(collection.length);
        // triggers the display of any out-of-order discussions that are now in order
        // enables endless scroller on the last one
        this.setState({
          discussions: collection.serialized()
        });
      }.bind(this)
    });
  },

  getLastDiscussionNode: function() {
    // if we have no discussions, return null
    if (!this.state.discussions.length) {
      return null;
    }
    // get <ul> node, and return the lastChild
    return this.refs.discussions.refs.list.getDOMNode().lastChild;
  },

  getInitialState: function() {
    // We don't need teams stored in state
    // since they don't really change that much (for now).
    this.team = store.findObject('teams', {url: this.props.team.url});
    return {
      discussions: [],
      // last discussion element
      lastItemEl: undefined
    };
  },

  componentWillMount: function() {
    // Get in-memory discussions on first load.
    // React recommends doing AJAX calls on componentDidMount,
    // so we keep these separate.
    this.getDiscussions(this.props.team.url);
  },

  componentWillUpdate: function() {
    // mark the last item in the list as a prop
  },

  componentDidMount: function() {
    // fetch an updated list of discussions on load
    this.fetchDiscussions();
  },

  componentDidUpdate: function() {
    // endless scroll setup
    var lastItemEl = this.getLastDiscussionNode();
    // can't call inViewport directly because it's not a CommonJS module
    window.inViewport(lastItemEl, this.fetchDiscussionsPagination);
  },

  componentWillReceiveProps: function(nextProps) {
    // When changing teams, get discussions from local and fetch from remote.
    // NOTE: If we had realtime, we could rely on our memory storage only
    // Because we don't, we need data from both local and remote storage.
    if (this.props.team.url !== nextProps.team.url) {
      this.team = store.findObject('teams', {'url': nextProps.team.url});
      this.getDiscussions();
      this.fetchDiscussions();
    }
  },

  componentWillUnmount: function() {
    // TODO: unbind inViewport's events (if there are any)
  }

});

module.exports = TeamDetail;
