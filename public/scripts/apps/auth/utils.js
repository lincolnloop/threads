define([], function () {
    "use strict";
    return {
        // check if user has authenticated
        isAuthenticated: function () {
            return !!localStorage.Authorization;
        },
        logout: function () {
            localStorage.removeItem('Authorization');
        }
    }
});
