"use strict";

var _ = require('underscore'),
    React = require('react'),
    EventsMixin = require('../eventsMixin');

var NavView = React.createClass({
    handleExpandClick: function () {
        console.log('handleExpandClick');
        // trigger event to toggle team list @
        // app/teams/views/list.jsx
        window.app.trigger('teams:toggle');
        return false;
    },
    render: function () {
        console.log('NavView:render');
        var actionClass = 'action';
        if (this.props.discussion) {
            actionClass += ' back';
        }
        return (
            <div className="wrapper">
                <span className={actionClass}>
                    <a className="expand" onClick={this.handleExpandClick}>Teams</a>
                    <a className="back">Back</a>
                </span>
                <span className="title">{this.props.title}</span>
                <a className="search">Search</a>
            </div>
        );
    }
});

module.exports = NavView;