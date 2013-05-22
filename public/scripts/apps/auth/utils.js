define([], function () {
    "use strict";
    return {
        // check if user has authenticated
        isAuthenticated: function () {
            return !!localStorage.Authentication;
        },
        logout: function () {
            localStorage.removeItem('Authentication');
        }
    }
});
