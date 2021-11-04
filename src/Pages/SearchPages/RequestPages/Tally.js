import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
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
                                <FontAwesomeIcon icon={["fas", icon]} size="sm" className="mr-1" fixedWidth/>{label}
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

        var transaction_link = "/search/" + transaction.txn_hash;
        var block_link = "/search/" + transaction.block_hash;

        return (
            <Container fluid className="mt-2 ml-0 mr-0 mb-3">
                <Card className="w-100 shadow p-1 bg-white rounded">
                    <Card.Body className="p-2">
                        <Card.Text>
                            <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"70vh"}>
                                <Table style={{"marginBottom": "0px"}}>
                                    <tbody>
                                        <tr style={{"line-height": "20px"}}>
                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                                <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" className="mr-1" fixedWidth/>{"Transaction"}
                                            </td>
                                            <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                                <Link to={transaction_link}>{transaction.txn_hash}</Link>
                                            </td>
                                        </tr>
                                        <tr style={{"line-height": "20px"}}>
                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                                <FontAwesomeIcon icon={["fas", "cubes"]} size="sm" className="mr-1" fixedWidth/>{"Block"}
                                            </td>
                                            <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                                <Link to={block_link}>{transaction.block_hash}</Link>
                                            </td>
                                        </tr>
                                        {this.generateAddressRows("times", "Errors", transaction.error_addresses)}
                                        {this.generateAddressRows("bolt", "Liars", transaction.liar_addresses)}
                                        <tr style={{"line-height": "20px"}}>
                                            <td class="cell-fit-padding-wide cell-truncate" style={{"borderTop": "none"}}>
                                                <FontAwesomeIcon icon={["fas", "calculator"]} size="sm" className="mr-1" fixedWidth/>{"Result"}
                                            </td>
                                            <td class="cell-fit-no-padding" style={tally_style}>
                                                {transaction.tally}
                                            </td>
                                        </tr>
                                        <tr style={{"line-height": "20px"}}>
                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                                <FontAwesomeIcon icon={["far", "clock"]} size="sm" className="mr-1" fixedWidth/>{"Timestamp"}
                                            </td>
                                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                                {TimeConverter.convertUnixTimestamp(transaction.time, "full") + " (epoch: " + transaction.epoch + ")"}
                                            </td>
                                        </tr>
                                        <tr style={{"line-height": "20px"}}>
                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                                <FontAwesomeIcon icon={["fas", "check"]} size="sm" className="mr-1" fixedWidth/>{"Status"}
                                            </td>
                                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                                {transaction.status}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Scrollbars>
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
