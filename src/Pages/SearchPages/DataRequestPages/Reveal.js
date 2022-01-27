import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TimeConverter from "../../../Services/TimeConverter"

export default class Reveal extends Component {
    generateEmptyTransactionCard() {
        return (
            <Card className="border-0 p-1 w-100 mb-3 ml-1 mr-1">
                <Card.Body>
                    <Card.Text></Card.Text>
                </Card.Body>
            </Card>
        );
    }

    generateTransactionCard(transaction) {
        var transaction_link = "/search/" + transaction.txn_hash;
        var block_link = "/search/" + transaction.block_hash;
        var address_link = "/search/" + transaction.txn_address;

        let reveal_style;
        if (transaction.error === true || transaction.liar === true) {
            reveal_style = {"borderTop": "none", "width": "100%", "paddingLeft": "0px", "paddingRight": "0px", "fontWeight": "bold"};
        }
        else {
            reveal_style = {"borderTop": "none", "width": "100%", "paddingLeft": "0px", "paddingRight": "0px"};
        }

        return (
            <Card className="w-100 shadow p-1 mb-3 ml-1 mr-1 bg-white rounded">
                <Card.Body className="p-2">
                    <Card.Text>
                        <Table style={{"marginBottom": "0px"}}>
                            <tbody>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                        <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Transaction"}
                                    </td>
                                    <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                        <Link to={transaction_link}>{transaction.txn_hash}</Link>
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                        <FontAwesomeIcon icon={["fas", "cubes"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Block"}
                                    </td>
                                    <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                        <Link to={block_link}>{transaction.block_hash}</Link>
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                        <FontAwesomeIcon icon={["fas", "user"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Address"}
                                    </td>
                                    <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                        <Link to={address_link}>{transaction.txn_address}</Link>
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                        <FontAwesomeIcon icon={["far", "eye"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Revealed"}
                                    </td>
                                    <td class="cell-fit-no-padding cell-truncate" style={reveal_style}>
                                        {transaction.reveal}
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                        <FontAwesomeIcon icon={["far", "clock"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Timestamp"}
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                        {TimeConverter.convertUnixTimestamp(transaction.time, "full") + " (epoch: " + transaction.epoch + ")"}
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                        <FontAwesomeIcon icon={["fas", "check"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Status"}
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                        {transaction.status}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    generateTransactionCards(transactions) {
        if (transactions === null) {
            return <div></div>;
        }

        var rows = [];
        for (var idx = 0; idx < transactions.length; idx += 2) {
            if (transactions.length % 2 === 1 && idx === transactions.length - 1) {
                rows.push(
                    <Row className="ml-0 mr-0">
                        <Col>
                            {this.generateTransactionCard(transactions[idx])}
                        </Col>
                        <Col>
                            {this.generateEmptyTransactionCard()}
                        </Col>
                    </Row>
                );
            }
            else {
                rows.push(
                    <Row className="ml-0 mr-0">
                        <Col>
                            {this.generateTransactionCard(transactions[idx])}
                        </Col>
                        <Col>
                            {this.generateTransactionCard(transactions[idx + 1])}
                        </Col>
                    </Row>
                );
            }
        }

        return (
            <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"75vh"}>
                <Container fluid className="pl-0 pr-0 mt-2">
                    {rows}
                </Container>
            </Scrollbars>
        );
    }

    render() {
        return this.generateTransactionCards(this.props.data);
    }
}
