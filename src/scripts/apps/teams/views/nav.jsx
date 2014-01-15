"use strict";

var _ = require('underscore'),
    React = require('react'),
    EventsMixin = require('../../../core/eventsMixin');

var NavView = React.createClass({
    render: function () {
        console.log('NavView:render');

        return (
            <div className="wrapper">
                <span className="action">
                    <a className="expand">Expand</a>
                    <a className="back">Back</a>
                </span>
                <span className="title">{this.props.title}</span>
                <a className="search">Search</a>
            </div>
        );
    }
});

module.exports = NavView;