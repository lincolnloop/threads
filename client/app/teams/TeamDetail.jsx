'use strict';

var React = require('react');
var log = require('loglevel');
var urls = require('../urls');
var store = require('../store');
var Header = require('../components/Header.jsx');
var DiscussionListView = require('../discussions/DiscussionList.jsx');

// TODO: Shim or fork inViewport so this is supported
require('in-viewport');

var TeamDetail = React.createClass({

  fetchDiscussions: function() {
    // Fetches discussion data from the remote API
    // and updates the component state.
    store.get('discussions', {'team__slug': this.props.team.slug}).then(function() {
      // TODO: Limit results to 20 * page number
      var discussions = store.findAll('discussions', {'team': this.props.team.url}) || [];
      this.setState({
        'discussions': discussions
      });
    }.bind(this));
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
    return {
      // last discussion element
      lastItemEl: undefined,
      // pageSize = 20
      page: 1
    };
  },

  render: function() {
    var team = this.props.team;
    var createDiscussionUrl = urls.get('discussion:create:team', {
      team_slug: team.slug
    });
    /*
      var bottomNav = React.DOM.nav({'id': 'bottom-nav'},
        React.DOM.a({
          'href': urls.get('discussion:create:team', {'team_slug': teamSlug}),
          'children': 'New Discussion'
        })
      );
    */
    return (
      <div className="team-detail">
        <h2>{team.name}</h2>
        <DiscussionListView discussions={this.state.discussions} ref="discussions" />
      </div>
    );
  },

  componentDidMount: function() {
    this.fetchDiscussions();
  },

  componentDidUpdate: function() {
    // endless scroll setup
    var lastItemEl = this.getLastDiscussionNode();
    // can't call inViewport directly because it's not a CommonJS module
    // TODO: Endless scrolling/pagination
    //window.inViewport(lastItemEl, this.fetchDiscussionsPagination);
  },

  componentWillReceiveProps: function(nextProps) {
    // When changing teams, get discussions from local and fetch from remote.
    // NOTE: If we had realtime, we could rely on our memory storage only
    // Because we don't, we need data from both local and remote storage.
    if (this.props.team.url !== nextProps.team.url) {
      this.fetchDiscussions();
    }
  },

  componentWillUnmount: function() {
    // TODO: unbind inViewport's events (if there are any)
  }

});

module.exports = TeamDetail;
