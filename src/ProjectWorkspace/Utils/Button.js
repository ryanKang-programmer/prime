import React from 'react';
import './Button.css'


class Button extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          active: false
        };
        this.handle = this.handle.bind(this)
    }

    handle() {
        const currentState = this.state.active;
        this.setState({ active: !currentState });
    }

    render() {
        let c = 'inactive-button'
        if (this.props.status === false || this.props.status === 0) {
            c = 'inactive-button'
        } else if (this.props.status === true || this.props.status === 1) {
            c = 'active-button'
        }
        return (
            <div>
                <button className={c + " " + this.props.more} onClick={this.props.onClick}>
                    {this.props.text}
                </button>
            </div>
        )
    }

}

export default Button;