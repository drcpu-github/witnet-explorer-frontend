import React, { Component } from 'react';
import Collapse from "react-bootstrap/Collapse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class CollapsiblePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
    }
  
    render() {
        var elements = this.props.elements;
        return (
            <div style={{marginTop : "5px"}}>
                <button type="button" className="btn btn-labeled" onClick={() => this.setState({ collapsed: !this.state.collapsed })} aria-controls="collapsible-panel" aria-expanded={this.state.collapsed}>
                    { this.state.collapsed ?
                        <FontAwesomeIcon icon={['fas', 'caret-right']} size="sm"/> :
                        <FontAwesomeIcon icon={['fas', 'caret-down']} size="sm"/>
                    }
                    {" "}
                    {elements.button_text}
                </button>
                <Collapse in={!this.state.collapsed}>
                    <div style={{marginLeft: "50px"}} id="collapsible-panel">
                        {elements.panel}
                    </div>
                </Collapse>
            </div>
        );
    }
}
