Pre-requisites
--------------

[libsass](https://github.com/hcatlin/libsass#libsass) `brew install libsass` on OS X

Install
-------

`npm install .`


Local Development
-----------------

`grunt build && grunt serve` will build the assets and start a server on port 9001. The development config expects you have Ginger's back-end Django server running on port 8000.

`grunt watch` will rebuild the necessary files when they change.


Production
-----------

`grunt dist && rsync -avz dist/* gingerhq.com:/var/www/next.gingerhq.com`
