## Project Setup

Step 1. Create a virtualenv (optional)

    $ mkvirtualenv m.gingerhq.com


Step 2. Install Node.js inside the virtualenv

    $ curl http://nodejs.org/dist/node-latest.tar.gz | tar xvz
    $ cd node-v*
    $ ./configure --prefix=$VIRTUAL_ENV
    $ make install

Step 3. Install grunt and other depenencies

    $ npm install -g grunt-cli
    $ npm install


Step 4. Run

    $ grunt serve

