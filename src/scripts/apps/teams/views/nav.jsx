"use strict";

var _ = require('underscore'),
    React = require('react'),
    EventsMixin = require('../../../core/eventsMixin');

var NavView = React.createClass({
    render: function () {
        console.log('NavView:render');

        return (
            <div className="wrapper">
                <span className="nav-action">
                    <a className="expand">Expand</a>
                    <a className="back">Back</a>
                </span>
                <span className="nav-title">{this.props.title}</span>
                <span className="search">Search</span>
            </div>
        );
    }
});

module.exports = NavView;