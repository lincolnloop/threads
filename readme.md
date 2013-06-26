## Project Setup

Step 1. Create a virtualenv

    $ mkvirtualenv m.gingerhq.com
    

Step 2. Add local.gingerhq.com to your hosts file (this is a whitelisted domain so cross-domain ajax requests can be done)

    $ 127.0.0.1 local.gingerhq.com


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
    $ open your browser on http://local.gingerhq.com:8000
    $ Get your api key from https://gingerhq.com/accounts/api-access/

