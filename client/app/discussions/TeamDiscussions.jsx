'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var zepto = require('browserify-zepto');
var log = require('loglevel');
var dispatcher = require('../dispatcher');
var eventsMixin = require('../mixins/eventsMixin');
var loadingMixin = require('../mixins/loadingMixin');
var urls = require('../urls');
var store = require('../store');
var DiscussionListView = require('../discussions/DiscussionList.jsx');
var EmptyDiscussionListView = require('../discussions/EmptyDiscussionList.jsx');

var TeamDiscussions = React.createClass({
  mixins: [loadingMixin, eventsMixin],

  setActiveDiscussion: function() {
    // --------------------
    // Active discussion
    // --------------------
    // 1. reset current active
    var listNode = ReactDOM.findDOMNode(this.refs.discussions);
    zepto('.active', listNode).removeClass('active');
    if (this.props.discussionId) {
      // 2. set active node
      zepto('[data-id="' + this.props.discussionId + '"]').addClass('active');
    }
  },

  handleLoadMore: function() {
    log.info('TeamDiscussions:fetchDiscussionsPagination');
    // fetch paginated discussions from the remote API
    // and update component state
    if (!this.state.page) {
      // no page means no data >> do nothing
      return;
    }
    var limit = 20;
    var page = this.state.page + 1;
    // loading animation
    this.emitter.emit('ajax', {'loading': true});
    // fetch next page
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
      // stop loading animation
      this.emitter.emit('ajax', {'loading': false});
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
    log.info('TeamDiscussions:render');
    var team = this.props.team;
    var createDiscussionUrl = urls.get('discussion:create:team', {
      team_slug: team.slug
    });
    var discussions = store.findAll('discussions', {'team': this.props.team.url}) || [];

    // front-end ordering of discussions by latest message.
    // step 1. Filter out discussion that have no latest_message attribute.
    // NOTE: For some reason this happens some times
    /*
    discussions = _.filter(discussions, function(discussion) {
      return !!discussion.latest_message;
    });
    // step 2. sort by latest message activity
    discussions = _.sortBy(discussions, function(discussion) {
      return discussion.latest_message.date_latest_activity;
    }).reverse();
    */
    return (
      <div className="team-detail content-view">
        <h2>{team.name}</h2>
        {discussions.length === 0 && this.state.page === null ? // create first discussion
          <EmptyDiscussionListView teamSlug={this.props.team.slug} /> : <div>
            <DiscussionListView discussions={discussions} ref="discussions" />
            {this.state.page ?
              <a onClick={this.handleLoadMore} className="load-more btn">Load more...</a>
            : null}
          </div>
        }
      </div>
    );
  },

  componentDidMount: function() {
    // show loading animation on the header
    this.emitter.emit('ajax', {'loading': true});
    this.request = store.get('discussions', {'team__slug': this.props.team.slug}).done(function(results) {
      // stop loading animation on the header
      this.emitter.emit('ajax', {'loading': false});
      // determine if we should show "load more" button
      if (results.length && results.length === 20) {
        // there might be more than one page (not 100% sure)
        try {
          this.setState({'page': 1});
        } catch(e) {
          //debugger;
        }
      } else {
        // there's only one page (100% confidence)
        try {
          this.setState({'page': null});
        } catch(e) {
          //debugger;
        }
      }
      // set main loading animation to false
      this.setState({'loading': false});
    }.bind(this));

    this.setActiveDiscussion();
  },

  componentDidUpdate: function() {
    this.setActiveDiscussion();
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
    log.debug('TeamDiscussions.unmount', this.request);
  }

});

module.exports = TeamDiscussions;
