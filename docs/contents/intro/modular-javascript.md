---
title: Modular JavaScript
date: 2014-17-03 18:00
template: page.jade
---
Modular JavaScript is key to building a maintainable component-based system. By using a module library such as [Browserify](http://browserify.org) or [Require.js](http://requirejs.org), you can easily write each component as a module in it's own file, have explicit dependencies for each module, avoid namespace pollution and facilitate testing.

***Browserify*** and ***Require.js*** are similar, but we ended up choosing ***Browserify***. It is a very flexible system that focuses on npm and CommonJS modules, but can also easily be used with ES6 or AMD modules, and other package managers like Bower or Component. Our preferred package manager is npm (Node Package Manager), and you can easily install packages using `npm install backbone` and use them directly in your modules with a `require()` statement. This is very similar to the pattern we see with something like `pip` and `import` in Python.

The drawback with **Browserify** is that it requires you to build your JavaScript files on every change even in development, but since this can be automated with Grunt and you can use source-maps to view the original source of your files, it's not much of a problem.

**Creating a module which imports underscore as `_` and backbone as `Backbone`.**

`app.js`

```javascript
var _ = require('underscore'),
    Backbone = require('backbone');

module.exports = _.extend({
    appName: 'Ginger Mobile'
}, Backbone.Events);
```


**Now, if you want to import your `app` module from above, and some other modules, you can just do**

`site.js`

```javascript
var app = require('app'),
    core = require('../core.js'),
    bar = require('lib/bar.js');

// do something
alert(app.appName);
```

A more comprehensive explanation can be found on the [project's github](https://github.com/substack/node-browserify) or just take a look at our [sample project](TODO).


To learn more about how browserify works for us, [read our blog post about it](http://lincolnloop.com/blog/untangle-your-javascript-browserify/). 