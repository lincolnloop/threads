/**
 * Provides utilities to deal with website/app urls. Provides functionality
 * for deep-linking Ajax calls, and a url mapper to generate dynamic urls.
 * @module urls
 */

/**
 * Utility for application urls
 *
 * @class urls
 * @namespace ohrl
 */

ohrl = function() {

    var _urls = {},
        _compiled = {},
        _lastHash = '',
        _nameMatcher = new RegExp('<([a-zA-Z0-9-_%]{1,})>', 'g');

    function _getArgs(urlName, path) {

        var args = {},
            name_matches = _urls[urlName].match(_nameMatcher),
            value_matches = path.match(_compiled[urlName]);

        if (name_matches) {
            var i, len, arg;
            for (i=0, len=name_matches.length; i<len; i+=1) {
                arg = name_matches[i].substring(1, name_matches[i].length-1);
                args[arg] = value_matches[i+1];;
            }
        }

        return args;
    };


    function _getName(path) {
        if (!path) {
            return;
        }
        for (url in _compiled) {
            if (path.match(_compiled[url])) {
                return url;
            }
        }
        return;
    };


    return {

        /**
         * Loads a set of urls names and paths
         * @method load
         * @static
         * @param {Object} urls an Object literal with names and paths like
         * {'taskEdit': '/task/edit/<taskId>/', 'taskCreate': '/task/create/'}
         * @return {Object} this for method chaining
         */
        load: function(urls) {

            for (url in urls) {
                if (urls.hasOwnProperty(url)) {
                    _compiled[url] = new RegExp('^' + urls[url].replace(_nameMatcher, "([a-zA-Z0-9-_%]{0,})") + '$');
                }
            }
            _urls = urls;
            return this;
        },

        /**
        * Returns a url from the list that matches the specified parameters.
        * A non-existant url will raise an exception.
        * @method get
        * @static
        * @param {string} name: url name to call
        * @param {string} kwargs: an option object literal with key/value
            that can be used to get urls that require parameters
        * @return {String} url path
        */
        get: function(name, kwargs) {

            var path = _urls[name];
            if (!path) {
                throw('URL not found: ' + name);
            }

            var _path = path;

            var key;
            for (key in kwargs) {
                if (kwargs.hasOwnProperty(key)) {
                    if (!path.match('<' + key +'>')) {
                        throw('Invalid parameter ('+ key +') for '+ name);
                    }
                    path = path.replace('<' + key +'>', kwargs[key]);
                }
            }

            var missing_args = path.match(_nameMatcher);
            if (missing_args) {
                throw('Missing arguments (' + missing_args.join(", ") + ') for url ' + _path);
            }

            return path;
        },

        /**
         * Recieves a url path, and returns a url object with the name and
         * variables if there is match in the url list
         * @method resolve
         * @static
         * @param {String} path the url path
         * @return {Object/undefined} url object or undefined
         */
        resolve: function(path) {
            var url = {},
                urlName,
                kwargs;
            urlName = _getName(path);
            //olive.log(url + ' => ' + urlName);
            if (urlName) {
                kwargs = _getArgs(urlName, path);
                url['name'] = urlName;
                url['kwargs'] = kwargs;
                return url;
            }

            return;
        }
    };

}();