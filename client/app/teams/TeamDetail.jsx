'use strict';

var React = require('react');
var log = require('loglevel');
var loadingMixin = require('../mixins/loadingMixin');
var urls = require('../urls');
var store = require('../store');
var Header = require('../components/Header.jsx');
var DiscussionListView = require('../discussions/DiscussionList.jsx');
var EmptyDiscussionListView = require('../discussions/EmptyDiscussionList.jsx');

var TeamDetail = React.createClass({
  mixins: [loadingMixin],

  handleLoadMore: function() {
    log.info('TeamDetail:fetchDiscussionsPagination');
    // fetch paginated discussions from the remote API
    // and update component state
    if (!this.state.page) {
      // no page means no data >> do nothing
      return;
    }
    var limit = 20;
    var page = this.state.page + 1;
    store.get('discussions', {
      'team__slug': this.props.team.slug,
      'page': page
    }).done(function(results) {
      // triggers the display of any out-of-order discussions that are now in order
      // enables endless scroller on the last one
      if (results.length && results.length === 20) {
        this.setState({'page': page});
      } else {
        this.setState({'page': null});
      }
    }.bind(this), function(error) {
      // there was an error with the ajax call
      // likely ran out of pages
      this.setState({
        'page': null
      })
    }.bind(this));
  },

  getInitialState: function() {
    // We don't need teams stored in state
    // since they don't really change that much (for now).
    return {
      // last discussion element
      'lastItemEl': undefined,
      // pageSize = 20
      'page': 0
    };
  },

  componentWillMount: function() {
    // TODO: Limit results to 20 * page number
    var discussions = store.findAll('discussions', {'team': this.props.team.url}) || [];
    this.setState({
      'discussions': discussions,
      'loading': discussions.length ? false : true
    });
  },

  render: function() {
    log.info('TeamDetail:render');
    var team = this.props.team;
    var createDiscussionUrl = urls.get('discussion:create:team', {
      team_slug: team.slug
    });
    var discussions = store.findAll('discussions', {'team': this.props.team.url}) || [];
    return (
      <div className="team-detail content-view">
        <h2>{team.name}</h2>
        {discussions.length === 0 && this.state.page === null ? // create first discussion
          <EmptyDiscussionListView teamSlug={this.props.team.slug} /> : <div>
            <DiscussionListView discussions={discussions} ref="discussions" />
            {this.state.page ?
              <a onClick={this.handleLoadMore} className="load-more">Load more...</a>
            : null}
          </div>
        }
      </div>
    );
  },

  componentDidMount: function() {
    store.get('discussions', {'team__slug': this.props.team.slug}).done(function(results) {
      if (results.length && results.length === 20) {
        this.setState({'page': 1});
      } else {
        this.setState({'page': null});
      }
      this.setState({'loading': false});
    }.bind(this));
  },

  componentWillReceiveProps: function(nextProps) {
    // When changing teams, get discussions from local and fetch from remote.
    // NOTE: If we had realtime, we could rely on our memory storage only
    // Because we don't, we need data from both local and remote storage.
    if (this.props.team.url !== nextProps.team.url) {
      this.fetchDiscussions();
    }
  }

});

module.exports = TeamDetail;
