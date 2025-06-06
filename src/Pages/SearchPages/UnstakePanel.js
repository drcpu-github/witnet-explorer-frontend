import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class UnstakePanel extends Component {
    constructor(props) {
        super(props);

        this.generateNanoWitValuesCheck = this.generateNanoWitValuesCheck.bind(this);

        this.state = {
            showNanoWitValues: false,
        };
    }

    generateDetailsCard(transaction, showNanoWitValues) {
        console.log(transaction);

        var txn_link = "/search/" + transaction.hash;
        var block_link = "/search/" + transaction.block;
        var validator_link = "/search/" + transaction.validator;
        var withdrawer_link = "/search/" + transaction.withdrawer;

        let transaction_time;
        if (transaction.timestamp === 0) {
            transaction_time = "";
        }
        else {
            transaction_time = TimeConverter.convertUnixTimestamp(transaction.timestamp, "full") + " (epoch: " + transaction.epoch + ")";
        }

        return (
            <table>
                <tbody>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Transaction"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={txn_link}>{transaction.hash}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "cubes"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Block"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={block_link}>{transaction.block}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "user"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Validator"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {
                                <Link to={validator_link}>{transaction.validator}</Link>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "user"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Withdrawer"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {
                                <Link to={withdrawer_link}>{transaction.withdrawer}</Link>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Unstake"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {
                                this.state.showNanoWitValues
                                    ? Formatter.formatValue(transaction.unstake_value) + " nWIT"
                                    : Formatter.formatWitValue(transaction.unstake_value, 2)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Fee"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {
                                this.state.showNanoWitValues
                                    ? Formatter.formatValue(transaction.fee) + " nWIT"
                                    : Formatter.formatWitValue(transaction.fee, 2)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "feather"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Weight"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {Formatter.formatValue(transaction.weight, 0)}
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "tachometer-alt"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Priority"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {Formatter.formatValue(transaction.priority, 0)}
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["far", "clock"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Timestamp"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {transaction_time}
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "check"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Status"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {
                                transaction.confirmed
                                    ? "Confirmed"
                                    : "Mined"
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    generateNanoWitValuesCheck() {
        return (
            <Form style={{"marginTop": "10px"}}>
                <Form.Check
                    id="showNanoWitValues"
                    inline={true}
                    checked={this.state.showNanoWitValues}
                    onChange={() => {
                        this.setState({ showNanoWitValues: !this.state.showNanoWitValues })
                    }}
                    label="Show values in nWIT"
                />
            </Form>
        );
    }

    render() {
        return (
            <Container fluid style={{ "padding": "0px", "max-height": "80vh" }}>
                <Card className="w-100 shadow p-1 mb-2 bg-white rounded" style={{ "max-height": "80vh" }}>
                    <Card.Body className="p-2" style={{ "max-height": "75vh" }}>
                        <Card.Text style={{ "max-height": "75vh" }}>
                            <Container fluid style={{ "max-height": "70vh", "overflow-x": "scroll" }}>
                                {
                                    this.generateDetailsCard(this.props.data, this.state.showNanoWitValues)
                                }
                            </Container>
                            <Container fluid style={{ "max-height": "5vh" }}>
                                {
                                    this.generateNanoWitValuesCheck()
                                }
                            </Container>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
