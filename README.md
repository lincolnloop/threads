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

If you don't have it installed already, install the gulp cli package globally.

    $ npm install -g gulp

Install local dependencies:

    $ npm install


Local Development
-----------------

First, create a `config/local.js` file by copying `config/local.example.js` and
making any desired changes.

    $ cp config/local.example.js config/local.js
    $ $EDITOR config/local.js

To build the app, start a development server on port 8080, and rebuild
automatically on changes, simply run gulp's default task:

    $ gulp

The frontend of threads will automatically look for a backend (API) connection
on the host specified in the `apiUrl` config parameter in your
`config/local.js`.

View a list of the gulp tasks with:

    $ gulp help


Bulding the Docs
----------------

To build the docs install [wintersmith](http://wintersmith.io/) globally:

    $ npm install -g wintersmith
    $ cd docs/
    $ wintersmith build

If you want to edit them without having to build on every change, just run:

    $ wintersmith preview

Production Build
----------------

To build a bundle for production:

    $ gulp build && rsync -avz build/* gingerhq.com:/var/www/next.gingerhq.com
