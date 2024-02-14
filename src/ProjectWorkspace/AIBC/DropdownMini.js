import React from 'react';
import './DropdownMini.css';

/**
 * 
 * Dropdown Mini component
 * @param {*} props: data
 * Dropdown menu that pushes text down and pulls text up
 * 
 */

// TODO: DEBUG JANKY CODE

class DropdownMini extends React.Component {

    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            toggleButton: 'v'
        }
    }

    // sets subtext as visible/invisible and toggles toggle button
    toggle(element) {
        console.log(element.value)
        if (element.tog === '>') {
            this.setState({toggleButton: 'v'})
            element.tog = 'v'
        } else {
            this.setState({toggleButton: '>'})
            element.tog = '>'
        }
        for (let miniElement of element.value) {
            const activity = miniElement.active
            miniElement.active = !activity
            this.forceUpdate()
        }
    }

    // uses recursion to recursively assign properties until reaches element of type 'text'
    // header -> active and is text
    // calls dropdown again when active and is dropdown
    render() {
        return (
            <div class="Dropdown">
                {this.props.data.map((element) => {
                    if (element.type == "num" && element.active == true) {
                        return <h6 className="data">{`${element.text} ${element.value}`}</h6>
                    } else if (element.type == "dropdown" && element.active == true && element.tog == '>') {
                        return <div>
                            <h5 onClick={() => this.toggle(element)} className={element.style}>{`${element.tog} ${element.text}`}</h5>
                            <DropdownMini data={element.value}/>
                        </div>
                    } else if (element.type == "dropdown" && element.active == true && element.tog == 'v') {
                        return <div>
                            <h5 onClick={() => this.toggle(element)} className={element.style}>{`${element.tog} ${element.text}`}</h5>
                            <DropdownMini data={element.value}/>
                        </div>
                    } 
                })}
            </div>
        );
    }
}

export default DropdownMini;