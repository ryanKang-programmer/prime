import React from 'react';
import './NavElements.css'

/**
 * For navbar
 */

class NavElements extends React.Component {
  render() {
    return (
      <div className={(this.props.a) + " " + (this.props.status ? "activeClass" : "inactiveClass")} onClick={() => this.props.onClick(this.props.id)}>
        <a><h5>{this.props.title}</h5></a>
        {this.props.children ? this.props.children : null}
      </div>
    );
  }
}

export default NavElements;