import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Form, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class ValueTransferPanel extends Component {
    constructor(props) {
        super(props);

        this.generateUtxoCheck = this.generateUtxoCheck.bind(this);

        this.state = {
            showUtxos: false,
        };
    }

    generateDetailsCard(transaction) {
        var txn_link = "/search/" + transaction.txn_hash;
        var block_link = "/search/" + transaction.block_hash;

        let transaction_time;
        if (transaction.txn_time === 0) {
            transaction_time = "";
        }
        else {
            transaction_time = TimeConverter.convertUnixTimestamp(transaction.txn_time, "full") + " (epoch: " + transaction.txn_epoch + ")";
        }

        return (
            <Table>
                <tbody>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Transaction"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={txn_link}>{transaction.txn_hash}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "cubes"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Block"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={block_link}>{transaction.block_hash}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Fee"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {Formatter.formatWitValue(transaction.fee, 2)}
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
                            {transaction.status}
                        </td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    generateInputOutputAddresses(data) {
        return (
            <Table>
                <tbody>
                    {
                        data.input_addresses.map(function(input, idx){
                            var input_link = "/search/" + input[0];
                            var output_link = idx < data.output_addresses.length
                                ? "/search/" + data.output_addresses[idx][0]
                                : "";

                            return (
                                <tr>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "width": "30%"}}>
                                        <Link to={input_link}>{input[0]}</Link>
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "right"}}>
                                        {Formatter.formatWitValue(input[1], 2)}
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "center", "width": "10%"}}>
                                        {
                                            idx  === 0
                                                ? <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]} size="lg"/>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "width": "30%"}}>
                                        {
                                            idx < data.output_addresses.length
                                                ? <Link to={output_link}>{data.output_addresses[idx][0]}</Link>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "right"}}>
                                        {
                                            idx < data.output_addresses.length
                                                ? Formatter.formatWitValue(data.output_addresses[idx][1], 2)
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "width": "15%"}}>
                                        {
                                            idx < data.output_addresses.length
                                                ? data.output_addresses[idx][3]
                                                    ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                    : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                : ""
                                        }
                                        {
                                            idx < data.output_addresses.length
                                                ? data.output_addresses[idx][3]
                                                    ? TimeConverter.convertUnixTimestamp(data.output_addresses[idx][2], "full")
                                                    : ""
                                                : ""
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                    {
                        data.output_addresses.slice(data.input_addresses.length, data.output_addresses.length).map(function(output, idx){
                            var output_link = "/search/" + output[0];

                            return (
                                <tr>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "width": "30%"}}></td>
                                    <td class="cell-fit" style={{"borderTop": "none"}}></td>
                                    <td class="cell-fit" style={{"borderTop": "none", "width": "10%"}}></td>
                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "width": "30%"}}>
                                        <Link to={output_link}>{output[0]}</Link>
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "textAlign": "right"}}>
                                        {Formatter.formatWitValue(output[1], 2)}
                                    </td>
                                    <td class="cell-fit" style={{"borderTop": "none", "width": "15%"}}>
                                        {
                                            output[3]
                                                ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        }
                                        {
                                            output[3]
                                                ? TimeConverter.convertUnixTimestamp(output[2], "full")
                                                : ""
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateInputOutputUtxos(data) {
        let output_idx = 0;

        return (
            <table style={{"width": "100%"}}>
                <tbody>
                    <tr>
                        <td style={{"verticalAlign": "top"}}>
                            <table style={{"width": "100%"}}>
                                <tbody>
                                    {
                                        Object.keys(data.input_utxos).map(function(key){
                                            var input_address = key;
                                            var input_address_link = <Link to={"/search/" + input_address}>{input_address}</Link>;

                                            var input_utxo_rows = data.input_utxos[key].map(function(input){
                                                var input_value = Formatter.formatWitValue(input[0], 2);
                                                var input_utxo_link = <Link to={"/search/" + input[1]}>{input[2] + ":" + input[1]}</Link>;
                                                return (
                                                    <tr>
                                                        <td class="cell-fit padding-horizontal-wide cell-truncate" style={{"borderTop": "none", "width": "80%"}}>
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
                                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "width": "80%"}}>
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
                        <td class="padding-horizontal" style={{"verticalAlign": "top"}}>
                            <table style={{"width": "100%"}}>
                                <tbody>
                                    {
                                        Object.keys(data.output_utxos).map(function(key){
                                            var output_address = key;
                                            var output_address_link = <Link to={"/search/" + output_address}>{output_address}</Link>;

                                            var output_utxo_rows = data.output_utxos[key].map(function(output){
                                                var output_text = output_idx + ":" + data.txn_hash;
                                                var output_value = Formatter.formatWitValue(output[0], 2);
                                                var output_timelock = output[2]
                                                    ? TimeConverter.convertUnixTimestamp(output[1], "full")
                                                    : "";
                                                var output_timelocked = output[2]
                                                    ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                                    : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" style={{"marginRight": "0.25rem"}}/>;

                                                output_idx = output_idx + 1;

                                                return (
                                                    <tr>
                                                        <td class="cell-fit padding-horizontal-wide cell-truncate" style={{"borderTop": "none", "width": "70%"}}>
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
                                                    <td class="cell-fit cell-truncate" style={{"borderTop": "none", "width": "70%"}}>
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
        );
    }

    generateUtxoCheck() {
        return (
            <Form>
                <Form.Check
                    id="showUtxos"
                    inline={true}
                    checked={this.state.showUtxos}
                    onChange={(checked: boolean) => {
                        this.setState({ showUtxos: !this.state.showUtxos })
                    }}
                    label="Show UTXO's"
                />
            </Form>
        );
    }

    render() {
        return (
            <Container fluid style={{"padding": "0px"}}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-3">
                        <Card.Text>
                            <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"75vh"}>
                                <Container fluid>
                                    {this.generateDetailsCard(this.props.data)}
                                    {
                                        this.state.showUtxos
                                            ? this.generateInputOutputUtxos(this.props.data)
                                            : this.generateInputOutputAddresses(this.props.data)
                                    }
                                    {this.generateUtxoCheck()}
                                </Container>
                            </Scrollbars>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
