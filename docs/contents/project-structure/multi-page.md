---
title: Multi-page Websites/Apps
date: 2014-17-03 18:00
template: page.jade
---

### Differences between single-page and multi-page app structure

There are two approaches we use for multi-page::

1. Use routers to determine what code gets loaded for each page (the same as single-page).
2. Use a different entry points for each page.

We tend to prefer 1), as it's easier to maintain and the structure is very similar to the structure of single-page apps, however, there are performance benefits to 2), as you won't need routers, and you can group your JS files in a way that you only load the files you need on each page. 

If your project requires you to pick option 2), Require.js/AMD make grouping dependencies and loading only the ones you need per page a trivial task. 
It's not that you can't do the same with Browserify, but Browserify is not a module loader, which means you'll have to manually include all dependencies on each document by adding a `<script src="group.min.js">` tag for each group.



#### Integration with server-side projects

In our example app, we have no server-side code at all, but our typical project usually has Django in the mix, which has it's own way of serving static files. The thing is, our JS and CSS are not static, and we shouldn't serve that whole directory. For that reason we're naming it `assets`, and pointing Django's STATIC_ROOT at the directory that contains the output from our `Grunt build` task.

Here's an example project root directory to serve as a guide:

```
.
├── Gruntfile.js
├── Makefile
├── Procfile
├── assets
├── README.md
├── config.rb
├── docs
├── fabfile.py
├── package.json
├── ginger
├── grunt
├── realtime
├── requirements
├── scripts
└── setup.py
```

The same `Gruntfile.js`, `config.rb` and `package.json` files and the `grunt` folder we have on the single-page app are stored in the root folder, but instead of naming the project directory `src`, we're naming it `assets` (the server-side code is stored on the `ginger` folder).