```
  ________                        __
 /_  __/ /_  ________  ____ _____/ /____
  / / / __ \/ ___/ _ \/ __ `/ __  / ___/
 / / / / / / /  /  __/ /_/ / /_/ (__  )
/_/ /_/ /_/_/   \___/\__,_/\__,_/____/
```


Installation
------------

Install libsass. On Mac OS X:

    $ brew install libsass

If you don't have it installed already, install the grunt cli package globally.

    $ npm install -g grunt

Install local dependencies:

    $ npm install


Local Development
-----------------

First, create a *config/local.js* file by copying *config/local.example.js* and
making any desired changes.

To build the app, start a development server on port 8080, and rebuild
automatically on changes, simply run grunt's default task:

    $ grunt

The frontend of threads will automatically look for a backend (API) connection
on the host specified in the `apiUrl` config parameter in your
*config/local.js*.


Production Build
----------------

To build a bundle for production:

    $ grunt dist && rsync -avz dist/* gingerhq.com:/var/www/next.gingerhq.com
