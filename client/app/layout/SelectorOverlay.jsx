var React = require('react');
var classnames = require('classnames');

var SelectorOverlay = React.createClass({

  getInitialState: function() {
    return {
      showOverlay: false
    }
  },

  toggleConfigurationOverlay: function(event) {
    this.setState({
      showOverlay: !this.state.showOverlay
    });
  },

  render: function() {

    var overlayClasses = classnames({
      'configuration-overlay': true,
      'active': this.state.showOverlay
    });

    return (
        <li className="configuration">
          <a className="settings icon" onClick={this.toggleConfigurationOverlay}>Settings</a>
          <div className={overlayClasses} onClick={this.props.handleLayoutClick}>
            <a data-layout="auto">Auto</a>
            <a data-layout="compact">Compact</a>
            <a data-layout="focused">Focused</a>
            <a data-layout="full">Full</a>
          </div>
        </li>
    );
  }
});

module.exports = SelectorOverlay;
