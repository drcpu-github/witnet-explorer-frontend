import React, { Component } from "react";
import { Card } from "react-bootstrap";

class ErrorCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error_value: props.errorValue
        };
    }

    render() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        <span>{this.state.error_value}</span>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default ErrorCard;
