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



### Integration with Django server-side projects

In our example app, we have no server-side code at all, but our typical project usually has Django in the mix, which has it's own way of serving static files. The thing is, our JS and CSS are not static (they are compiled/combined), and we shouldn't serve that whole directory. For that reason we're keeping the name `client` (as opposed the usual `static`), and pointing Django's STATIC_ROOT at the directory that contains the output from our `gulp build` task.

Here's an example project root directory to serve as a guide:

```
.
├── gulpfile.js
├── Makefile
├── Procfile
├── client
├── README.md
├── config.rb
├── docs
├── fabfile.py
├── package.json
├── appname
├── gulp
├── realtime
├── requirements
├── scripts
└── setup.py
```

The same `gulpfile.js`, and `package.json` files and the `gulp` folder we have on the single-page app are kept, and the same goes for the `client` directory. Server-side code is stored in `appname` folder for Django import convenience purposes.