import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class ValueTransferPanel extends Component {
    constructor(props) {
        super(props);

        this.generateUtxoCheck = this.generateUtxoCheck.bind(this);

        this.state = {
            showUtxos: false,
            showNanoWitValues: false,
        };
    }

    generateDetailsCard(transaction) {
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
                        data.inputs_merged.map(function(input, idx){
                            var input_link = "/search/" + input.address;
                            var output_link = idx < data.output_addresses.length
                                ? "/search/" + data.output_addresses[idx]
                                : "";

                            return (
                                <tr>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "max-width": "40%"}}>
                                        <Link to={input_link}>{input.address}</Link>
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "right"}}>
                                        {
                                            showNanoWitValues
                                                ? Formatter.formatValue(input.value) + " nWIT"
                                                : Formatter.formatWitValue(input.value, 2)
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "center"}}>
                                        {
                                            idx === 0
                                                ? <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]} size="lg"/>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "max-width": "40%"}}>
                                        {
                                            idx < data.output_addresses.length
                                                ? <Link to={output_link}>{data.output_addresses[idx]}</Link>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "right"}}>
                                        {
                                            idx < data.output_values.length
                                                ? showNanoWitValues
                                                    ? Formatter.formatValue(data.output_values[idx]) + " nWIT"
                                                    : Formatter.formatWitValue(data.output_values[idx], 2)
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none"}}>
                                        {
                                            idx < data.timelocks.length
                                                ? data.timelocks[idx] > Date.now()
                                                    ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                    : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                : ""
                                        }
                                        {
                                            idx < data.timelocks.length
                                                ? data.timelocks[idx] > Date.now()
                                                    ? TimeConverter.convertUnixTimestamp(data.timelocks[idx], "full")
                                                    : ""
                                                : ""
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                    {
                        data.output_addresses.slice(data.inputs_merged.length, data.output_addresses.length).map(function(output_address, idx){
                            // Add the number of inputs to the index to offset for the already displayed outputs
                            idx += data.inputs_merged.length;

                            var output_link = "/search/" + output_address;

                            return (
                                <tr>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "max-width": "40%"}}></td>
                                    <td class="cell-fit" style={{"borderTop": "none"}}></td>
                                    <td class="cell-fit" style={{"borderTop": "none"}}></td>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "max-width": "40%"}}>
                                        <Link to={output_link}>{output_address}</Link>
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "right"}}>
                                        {
                                            showNanoWitValues
                                                ? Formatter.formatValue(data.output_values[idx]) + " nWIT"
                                                : Formatter.formatWitValue(data.output_values[idx], 2)
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none"}}>
                                        {
                                            data.timelocks[idx] > Date.now()
                                                ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        }
                                        {
                                            data.timelocks[idx] > Date.now()
                                                ? TimeConverter.convertUnixTimestamp(data.timelocks[idx], "full")
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

    generateInputOutputUtxos(data, showNanoWitValues) {
        // Group input utxos by address
        var grouped_inputs = {};
        data.input_utxos.forEach(function(utxo) {
            if (!(utxo.address in grouped_inputs)) {
                grouped_inputs[utxo.address] = []
            }
            grouped_inputs[utxo.address].push({
                "value": utxo.value,
                "utxo": utxo.input_utxo.split(":")
            })
        });

        // Group output utxos by address
        var grouped_outputs = {};
        data.utxos.forEach(function (utxo) {
            if (!(utxo.address in grouped_outputs)) {
                grouped_outputs[utxo.address] = []
            }
            grouped_outputs[utxo.address].push({
                "value": utxo.value,
                "timelocked": utxo.locked,
                "timelock": utxo.timelock
            })
        });

        let output_idx = 0;
        return (
            <div
                style={{
                    "display": "block",
                    "overflow-y": "scroll",
                    "max-height": "45vh",
                    "width": "100%",
                }}
            >
                <table style={{ "width": "100%"}}>
                    <tbody
                        style={{
                            "border-collapse": "separate",
                            "margin": "0px",
                            "width": "100%",
                        }}
                    >
                        <tr style={{ "max-width": "100%" }} >
                            <td style={{ "max-width": "50%", "verticalAlign": "top" }}>
                                <table>
                                    <tbody>
                                        {
                                            Object.keys(grouped_inputs).map(function(address) {
                                                var input_address_link = <Link to={"/search/" + address}>{address}</Link>;

                                                var input_utxo_rows = grouped_inputs[address].map(function(input){
                                                    var input_value = showNanoWitValues
                                                        ? Formatter.formatValue(input.value) + " nWIT"
                                                        : Formatter.formatWitValue(input.value, 2);
                                                    var input_utxo_link = (
                                                        <Link to={"/search/" + input.utxo[0]}>
                                                            {input.utxo[1] + ":" + input.utxo[0]}
                                                        </Link>
                                                    );
                                                    return (
                                                        <tr>
                                                            <td class="cell-fit padding-horizontal-wide cell-truncate" style={{ "borderTop": "none" }}>
                                                                {input_utxo_link}
                                                            </td>
                                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none", "textAlign": "right"}}>
                                                                {input_value}
                                                            </td>
                                                        </tr>
                                                    );
                                                });

                                                return ([
                                                    <tr>
                                                        <td class="cell-fit cell-truncate" style={{ "borderTop": "none", "width": "100%" }}>
                                                            {input_address_link}
                                                        </td>
                                                        <td class="cell-fit" style={{"borderTop": "none"}}/>
                                                        <td class="cell-fit" style={{"borderTop": "none"}}/>
                                                    </tr>,
                                                    input_utxo_rows
                                                ]);
                                            })
                                        }
                                    </tbody>
                                </table>
                            </td>
                            <td style={{"verticalAlign": "top"}}>
                                <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]} size="lg"/>
                            </td>
                            <td class="padding-horizontal" style={{ "max-width": "50%", "verticalAlign": "top" }}>
                                <table>
                                    <tbody>
                                        {
                                            Object.keys(grouped_outputs).map(function(address){
                                                var output_address_link = <Link to={"/search/" + address}>{address}</Link>;

                                                var output_utxo_rows = grouped_outputs[address].map(function(output){
                                                    var output_text = output_idx + ":" + data.hash;
                                                    var output_value = showNanoWitValues
                                                        ? Formatter.formatValue(output.value) + " nWIT"
                                                        : Formatter.formatWitValue(output.value, 2);
                                                    var output_timelock = output.timelocked
                                                        ? TimeConverter.convertUnixTimestamp(output.timelock, "full")
                                                        : "";
                                                    var output_timelocked = output.timelocked
                                                        ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                        : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" style={{"marginRight": "0.25rem"}}/>;

                                                    output_idx = output_idx + 1;

                                                    return (
                                                        <tr>
                                                            <td class="cell-fit padding-horizontal-wide cell-truncate" style={{ "borderTop": "none" }}>
                                                                {output_text}
                                                            </td>
                                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none", "textAlign": "right"}}>
                                                                {output_value}
                                                            </td>
                                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                                                {output_timelocked}
                                                                {output_timelock}
                                                            </td>
                                                        </tr>
                                                    );
                                                });

                                                return ([
                                                    <tr>
                                                        <td class="cell-fit cell-truncate" style={{ "borderTop": "none", "width": "100%" }}>
                                                            {output_address_link}
                                                        </td>
                                                        <td class="cell-fit" style={{"borderTop": "none"}}/>
                                                        <td class="cell-fit" style={{"borderTop": "none"}}/>
                                                    </tr>,
                                                    output_utxo_rows
                                                ]);
                                            })
                                        }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    generateUtxoCheck() {
        return (
            <Form style={{ "padding-top": "5px" }}>
                <Form.Check
                    id="showUtxos"
                    inline={true}
                    checked={this.state.showUtxos}
                    onChange={() => {
                        this.setState({ showUtxos: !this.state.showUtxos })
                    }}
                    label="Show UTXO's"
                />
            </Form>
        );
    }

    generateNanoWitValuesCheck() {
        return (
            <Form>
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
                            <Container fluid style={{ "max-height": "75vh" }}>
                                {
                                    this.generateDetailsCard(this.props.data)
                                }
                                {
                                    this.state.showUtxos
                                        ? this.generateInputOutputUtxos(this.props.data, this.state.showNanoWitValues)
                                        : this.generateInputOutputAddresses(this.props.data, this.state.showNanoWitValues)
                                }
                                {
                                    this.generateUtxoCheck()
                                }
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
