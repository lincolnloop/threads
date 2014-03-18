---
title: Single-Page/Mobile Web Apps
date: 2014-17-03 18:00
template: page.jade
---

Step by step description of the project structure for single page/mobile web apps.

For an always up-to-date project structure, [check the repository](https://github.com/lincolnloop/ginger-mobile)



## Root

The root directory holds configuration files for `Gulp`, `Sass/compass`, `npm` as well as an example .env file where any local configuration should be set.

```
.
├── gulpfile.js
├── package.json
```

#### gulpfile.js

The base [gulp](http://gulpjs.com/) configuration file. We use this file to define custom tasks that include two or more of the individual tasks defined in the `gulp` directory.

#### package.json

`npm` requirements for the project. Requirements like underscore, backbone, react, etc.. will be defined here (no more vendoring), and running `npm install` will, much like pip, install them on your project and together with Browserify, will allow you to `var Backbone = require('backbone')` (for example) from your JavaScript code.


## ./gulp

We store every individual *gulp* task in it's own file on this directory.

```
.
├── app.js
├── clean.js
├── fonts.js
├── jshint.js
├── noop.js
├── sass.js
├── serve.js
├── tests.js
├── vendor.js
└── watch.js
```

## ./client
```
.
├── index.js
├── app
├── sass
├── static
└── tests
```

#### index.js

This is the app's entry point. Everything that needs to be run on page load (except the initial rendering) or that needs to be accessed as a "global" variable should be handled by `app.js`. This includes things like::

* App configuration settings storage (window.app.config)
* Starting the router.
* Fetch initial data.


## ./client/app

We recommend grouping your app by functionality rather than by module type. This is a principle that derives from our component-based approach, and we try to keep each *app* as self-contained as possible and have as little as possible dependencies to other apps.

```
.
├── app.jsx
├── auth
├── components
├── discussions
├── messages
├── router.js
├── store.js
├── teams
├── urls.js
└── utils
```

Let's take a look at each individual file listed here first:

#### app.jsx

This is our main React view, and it's job is to render the whole app and listen to route changes. 

##### Binding the route events

```javascript
  componentWillMount: function() {
    //
    // Route view binding
    //
    router.on('route:index', this.index);
    router.on('route:signIn', this.signIn);
    router.on('route:signOut', this.signOut);
    router.on('route:team:detail', this.teamDetail);
    router.on('route:team:create', this.discussionCreate);
    router.on('route:discussion:detail', this.discussionDetail);
  },
```

##### An example view

```javascript


  discussionCreate: function (teamSlug) {
    log.debug('DiscussionRouter:create');
    var team = store.find('teams', {slug: teamSlug});
    // content > create view
    var content = CSSTransitionGroup({
      'transitionName': 'content',
      'component': React.DOM.div,
      'children': DiscussionCreateView({
        'team': team.url,
        'key': 'create-' + team.slug
      })
    });
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': content,
      'topNav': Nav({
        'title': team.name,
        'toggleTeamNav': this.toggleTeamNav,
        'team': team
      })
    });
  },
```

#### router.js

This is where we define our url routes for the whole app. No callbacks should be defined here, just the url paths and names.

```javascript
var AppRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    '': 'index',
    'sign-in/': 'signIn',
    'sign-out/': 'signOut',
    ':team/': 'team:detail',
    'discussion/create/:teamSlug/': 'team:create',
    ':teamSlug/:discussionId/:discussionSlug/': 'discussion:detail'
  }
});
```

Route changes should be defined in `app.jsx` by listening to the router and the url name:

```javascript
router.on('route:signOut', this.signOut);
```

#### urls.js

Uses [Crossing](https://www.npmjs.org/package/crossing) to store the a named url list for your whole app in a central location, that you can later access via crossing's API.


#### store.js

Uses [Amygdala](https://www.npmjs.org/package/amygdala) library, and is the module through which we interact with the API/session cache.

## ./client/utils

The `./client/utils` directory is where you store project-specific utilities that are shared by all apps. 

```
.
├── config.js
├── fetch.js
├── gravatar.js
└── mixins.js
```

## ./client/components

Similar to `utils` above, the `./client/components` directory is where you store you're project-specific, reusable React components.

```.
├── markdown.jsx
└── nav.jsx
```


### Let's look at the teams *app* in detail.

## ./client/app/discussions

```
.
├── create.jsx
├── detail.jsx
├── item.jsx
└── list.jsx
```

As you can see everything here are React components. This is also true for other *apps*, like `auth`, `discussions` or `messages`, but sometimes you may have an additional `utils.js` for *app* specific utilities.

The naming convention is relatively loose, but we try to keep it descriptive.


## ./client/sass

TBD

```
.
├── _settings.scss
├── app.scss
├── components
│   ├── _comments.scss
│   └── _forms.scss
├── pages
│   └── _home.scss
└── site
    ├── _defaults.scss
    ├── _layout.scss
    └── _nav.scss
```

## ./client/static

Static files directory. All our JavaScript and CSS is compiled, so this is the directory where static files like static html pages or documents should be kept.

```
.
├── 404.html
└── robots.txt
```