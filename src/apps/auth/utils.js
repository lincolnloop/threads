"use strict";

module.exports = {
    // check if user has authenticated
    isAuthenticated: function () {
        return !!localStorage.apiKey;
    },
    logout: function () {
        localStorage.removeItem('apiKey');
    }
};
