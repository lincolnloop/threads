var React = require('react');
var classnames = require('classnames');
var LayoutStore = require('./LayoutStore');
var layoutActions = require('./actions');

var SelectorOverlay = React.createClass({

  handleLayoutClick: function(evt) {
    evt.preventDefault();
    var layout = evt.target.dataset.layout;
    if (layout) {
      layoutActions.changeMode(layout);
    }
  },

  toggleConfigurationOverlay: function(event) {
    this.setState({
      showOverlay: !this.state.showOverlay
    });
  },

  getInitialState: function() {
    return {
      showOverlay: false
    }
  },

  render: function() {
    var overlayClasses = classnames({
      'configuration-overlay': true,
      'active': this.state.showOverlay
    });
    return (
        <li className="configuration">
          <a className="settings icon" onClick={this.toggleConfigurationOverlay}>Settings</a>
          <div className={overlayClasses} onClick={this.handleLayoutClick}>
            <a data-layout="auto">Auto</a>
            <a data-layout="compact">Compact</a>
            <a data-layout="full">Full</a>
          </div>
        </li>
    );
  }
});

module.exports = SelectorOverlay;
