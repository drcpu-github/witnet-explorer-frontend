import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class StakePanel extends Component {
    constructor(props) {
        super(props);

        this.generateNanoWitValuesCheck = this.generateNanoWitValuesCheck.bind(this);

        this.state = {
            showNanoWitValues: false,
        };
    }

    generateDetailsCard(transaction) {
        console.log(transaction);

        var txn_link = "/search/" + transaction.hash;
        var block_link = "/search/" + transaction.block;

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

    generateInputOutputAddresses(data, showNanoWitValues) {
        // Sum input values by address
        var summed_inputs = {};
        data.inputs.forEach(function(input) {
            if (!(input.address in summed_inputs)) {
                summed_inputs[input.address] = 0
            }
            summed_inputs[input.address] += input.value;
        });

        var stake_value = showNanoWitValues
            ? Formatter.formatValue(data.stake_value) + " nWIT"
            : Formatter.formatWitValue(data.stake_value, 2);

        var validator_link = "/search/" + data.validator;
        var withdrawer_link = "/search/" + data.withdrawer;

        var extra_rows = Array.from(
            {length: Math.max(0, 3 - Object.keys(summed_inputs).length)},
            (_value, index) => Object.keys(summed_inputs).length + index
        );

        return (
            <table style={{ "width": "100%", "max-height": "45vh" }}>
                <tbody
                    style={{
                        "border-collapse": "separate",
                        "display": "block",
                        "max-height": "45vh",
                        "overflow-y": "scroll",
                        "margin": "0px",
                    }}
                >
                    {
                        Object.keys(summed_inputs).map(function(address, idx) {
                            var input_link = "/search/" + address;

                            return (
                                <tr>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "max-width": "40%"}}>
                                        <Link to={input_link}>{address}</Link>
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "right"}}>
                                        {
                                            showNanoWitValues
                                                ? Formatter.formatValue(summed_inputs[address]) + " nWIT"
                                                : Formatter.formatWitValue(summed_inputs[address], 2)
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "center"}}>
                                        {
                                            idx === 0
                                                ? <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]} size="lg"/>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"borderTop": "none"}}>
                                        {
                                            idx === 0
                                                ? "Staking " + stake_value + " on"
                                                : idx === 1
                                                    ? <Link to={validator_link} style={{"paddingLeft": "30px"}}>{data.validator}</Link>
                                                    : idx === 2
                                                        ? <Link to={withdrawer_link} style={{"paddingLeft": "30px"}}>{data.withdrawer}</Link>
                                                        : ""
                                        }
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"borderTop": "none"}}>
                                        {
                                            idx === 0
                                                ? ""
                                                : idx === 1
                                                    ? " (validator)"
                                                    : idx === 2
                                                        ? " (withdrawer)"
                                                        : ""
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                    {
                        extra_rows.map(function(idx) {
                            return (
                                <tr>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "max-width": "40%"}}></td>
                                    <td class="cell-fit" style={{"borderTop": "none"}}></td>
                                    <td class="cell-fit" style={{"borderTop": "none"}}></td>
                                    <td class="cell-fit-no-padding" style={{"borderTop": "none"}}>
                                        {
                                            idx === 1
                                                ? <Link to={validator_link} style={{"paddingLeft": "30px"}}>{data.validator}</Link>
                                                : idx === 2
                                                    ? <Link to={withdrawer_link} style={{"paddingLeft": "30px"}}>{data.withdrawer}</Link>
                                                    : ""
                                        }
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"borderTop": "none"}}>
                                        {
                                            idx === 1
                                                ? " (validator)"
                                                : idx === 2
                                                    ? " (withdrawer)"
                                                    : ""
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
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
                                    this.generateDetailsCard(this.props.data)
                                }
                                {
                                    this.generateInputOutputAddresses(this.props.data, this.state.showNanoWitValues)
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
