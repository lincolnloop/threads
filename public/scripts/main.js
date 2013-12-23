var gingerApp = require('./core/app'),
    AppRouter = require('./router');
/*
* Initialize the main AppRouter
*/
gingerApp.on('ready', function () {
    console.log('main.js:router');
    new AppRouter();
});

