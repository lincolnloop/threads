'use strict';

var Crossing = require('crossing');

var urls = new Crossing();

urls.load({
  'home': '/',

  'api:attachment': '/api/v2/attachment/',
  'api:discussion': '/api/v2/discussion/',
  'api:discussionChange': '/api/v2/discussion/<discussion_id>/',
  'api:discussionFromMessage': '/api/v2/discussion/from-message/<message_id>/',
  'api:discussion:team': '/api/v2/discussion/?team__slug=<team_slug>',
  'api:invitation': '<team_resource>invitation/',
  'api:message': '/api/v2/message/',
  'api:messageChange': '/api/v2/message/<message_id>/',
  'api:notification': '/api/v2/notifications/',
  'api:user': '/api/v2/user/',
  'api:refresh_tokens': '/api/v2/user/refresh-tokens/',
  'api:lastread': '/api/v2/discussion/<discussion_id>/read/',
  'api:searchresult': '/api/v2/searchresult/',
  'api:fileUpload': '/api/v2/attachment/upload/',
  'api:vote': '/api/v2/message/<message_id>/vote/',
  'api:message:detail': '/api/v2/message/<message_id>/',
  'api:message:collapseExpand': '/api/v2/message/<message_id>/collapse/',
  'api:message:fork': '/api/v2/message/<message_id>/fork/',
  'api:message:preview': '/api/v2/message/preview/',
  'api:team': '/api/v2/team/',
  'api:team:member': '/api/v2/team/<team>/member/<user>/',
  'api:billingprofile': '/api/v2/billingprofile/',
  'api:userprofile': '/api/v2/userprofile/',

  'team:list': '/teams/',
  'team:create': '/teams/create/',
  'discussion:create': '/discussion/create/',
  'discussion:create:team': '/discussion/create/<team_slug>/',
  'discussion:detail': '/<team_slug>/<discussion_id>/<slug>/',
  'discussion:detail:message': '/<team_slug>/<discussion_id>/<slug>/#<message_id>',
  'message:reply': '/<team_slug>/<discussion_id>/<slug>/<message_id>/reply/',
  'message:edit': '/<team_slug>/<discussion_id>/<slug>/<message_id>/edit/',
  'discussion:changeTitle': '/msg/<discussion_id>/title/',
  'search': '/search/',
  'search:team': '/search/<team_slug>/',
  'message:create': '/msg/<discussion_id>/',
  'team:detail': '/<slug>/',
  'team:edit': '/<slug>/edit/',
  'signIn': '/sign-in/',
  'signOut': '/sign-out/',
  'welcome': '/welcome/',
  'notifications': '/notifications/',
  'redirect': '/goto/?url=<url>',
  'loginRedirect': '/accounts/login/?next=<next>&logged_out=1'
  //'team:detail:limit': '<slug>/<limit>/',
});

module.exports = urls;
