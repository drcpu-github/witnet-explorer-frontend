import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TimeConverter from "../../../Services/TimeConverter"

export default class Tally extends Component {
    generateAddressRows(icon, label, addresses) {
        return (
            addresses.map(function(address, idx){
                var address_link = "/search/" + address;
                if (idx === 0) {
                    return (
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", icon]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{label}
                            </td>
                            <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                <Link to={address_link}>{address}</Link>
                            </td>
                        </tr>
                    );
                }
                else {
                    return (
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}></td>
                            <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                <Link to={address_link}>{address}</Link>
                            </td>
                        </tr>
                    );
                }
            })
        );
    }

    generateTransactionCard(transaction) {
        if (transaction === null) {
            return <div></div>;
        }

        let tally_style;
        if (transaction.success === true) {
            tally_style = {"borderTop": "none", "width": "100%", "paddingLeft": "0px", "paddingRight": "0px"};
        }
        else {
            tally_style = {"borderTop": "none", "width": "100%", "paddingLeft": "0px", "paddingRight": "0px", "fontWeight": "bold"};
        }

        var transaction_link = "/search/" + transaction.hash;
        var block_link = "/search/" + transaction.block;

        return (
            <Container fluid className="mt-2 ml-0 mr-0 mb-3">
                <Card className="w-100 shadow p-1 bg-white rounded">
                    <Card.Body className="p-2">
                        <Card.Text>
                            <Table responsive style={{ "borderCollapse": "separate", "marginBottom": "0px", "display": "block", "overflow": "auto", "maxHeight": "70vh" }}>
                                <tbody>
                                    <tr style={{ "line-height": "20px" }}>
                                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Transaction"}
                                        </td>
                                        <td class="cell-fit-no-padding cell-truncate" style={{ "borderTop": "none", "width": "100%" }}>
                                            <Link to={transaction_link}>{transaction.hash}</Link>
                                        </td>
                                    </tr>
                                    <tr style={{ "line-height": "20px" }}>
                                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                            <FontAwesomeIcon icon={["fas", "cubes"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Block"}
                                        </td>
                                        <td class="cell-fit-no-padding cell-truncate" style={{ "borderTop": "none", "width": "100%" }}>
                                            <Link to={block_link}>{transaction.block}</Link>
                                        </td>
                                    </tr>
                                    {this.generateAddressRows("times", "Errors", transaction.error_addresses)}
                                    {this.generateAddressRows("bolt", "Liars", transaction.liar_addresses)}
                                    <tr style={{ "line-height": "20px" }}>
                                        <td class="cell-fit-padding-wide cell-truncate" style={{ "borderTop": "none" }}>
                                            <FontAwesomeIcon icon={["fas", "calculator"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Result"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={tally_style}>
                                            {transaction.tally}
                                        </td>
                                    </tr>
                                    <tr style={{ "line-height": "20px" }}>
                                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                            <FontAwesomeIcon icon={["far", "clock"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Timestamp"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                                            {TimeConverter.convertUnixTimestamp(transaction.timestamp, "full") + " (epoch: " + transaction.epoch + ")"}
                                        </td>
                                    </tr>
                                    <tr style={{ "line-height": "20px" }}>
                                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                            <FontAwesomeIcon icon={["fas", "check"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Status"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                                            {
                                                transaction.confirmed
                                                    ? "Confirmed"
                                                    : "Mined"
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    render() {
        return this.generateTransactionCard(this.props.data);
    }
}
