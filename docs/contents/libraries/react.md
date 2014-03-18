---
title: React
date: 2014-17-03 18:00
template: page.jade
---

[React](http://facebook.github.io/react/) is essentially our V in MVC (NOTE: we're debating if/how we can expand it's role).

React's data-driven, no templating approach, makes it perfectly suited for complex web applications that are API-based, and have very dynamic UI's (or even realtime) with lots of reusable components, but it's simplicity and flexibility are also great fits for smaller apps and it blends perfectly with other tools, such as Backbone Models and Routers.

Here's a React component that renders something like facebook's comments ([taken from the React tutorial](http://facebook.github.io/react/docs/tutorial.html)):

```javascript
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});
```

And this is how you render it in a page:

```javascript
React.renderComponent(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
```

## The Virtual DOM

The name *Virtual DOM* sounds a scary at first, but in reality it's *just* a collection of nested JavaScript objects that describe how your DOM looks.
When you render a React component, you're not touching the DOM directly, but instead, React renders into an intermediary state, called Virtual DOM, and then does a diff between your new Virtual DOM representation and the one that represents the actual state of the UI. 
With the result of that diff, React will then internally decide how to make the changes in the most efficient way (which may not always be the case).

#### Performance considerations

TODO: Do some performance evaluations around rendering the same component with lots of data changes vs unmounting and re-mounting it with the new data.


## Component Lifecycle overview

