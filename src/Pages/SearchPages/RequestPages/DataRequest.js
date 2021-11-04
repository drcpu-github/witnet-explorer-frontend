import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../../Services/Formatter";
import TimeConverter from "../../../Services/TimeConverter"

export default class DataRequest extends Component {
     generateTransactionCard(transaction) {
        var txn_link = "/search/" + transaction.txn_hash;
        var block_link = "/search/" + transaction.block_hash;
        return (
            <Container className="mr-0 ml-0 p-0">
                <Table style={{"marginBottom": "0px"}}>
                    <tbody>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" className="mr-1" fixedWidth/>{"Transaction"}
                            </td>
                            <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                                <Link to={txn_link}>{transaction.txn_hash}</Link>
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
                        {
                            transaction.addresses.map(function(address, idx){
                                var address_link = "/search/" + address;
                                if (idx === 0) {
                                    return (
                                        <tr style={{"line-height": "20px"}}>
                                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                                <FontAwesomeIcon icon={["fas", "user"]} size="sm" className="mr-1" fixedWidth/>{"Addresses"}
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
                        }
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["far", "clock"]} size="sm" className="mr-1" fixedWidth/>{"Timestamp"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {TimeConverter.convertUnixTimestamp(transaction.txn_time, "full") + " (epoch: " + transaction.txn_epoch + ")"}
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
                        <tr style={{"line-height": "20px"}}/>
                    </tbody>
                </Table>
            </Container>
        );
    }

     generateDataRequestCard(data_request) {
        return (
            <Container className="mr-0 ml-0 p-0">
                <Table style={{"marginBottom": "0px"}}>
                    <tbody>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "search"]} size="sm" className="mr-1" fixedWidth/>{"Witnesses"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {data_request.witnesses}
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "trophy"]} size="sm" className="mr-1" fixedWidth/>{"Reward"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {Formatter.formatWitValue(data_request.witness_reward, 0)}
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["far", "handshake"]} size="sm" className="mr-1" fixedWidth/>{"Collateral"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {Formatter.formatWitValue(data_request.collateral, 2)}
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "percentage"]} size="sm" className="mr-1" fixedWidth/>{"Consensus"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {data_request.consensus_percentage + "%"}
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm" className="mr-1" fixedWidth/>{"Fee"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {Formatter.formatWitValue(data_request.commit_and_reveal_fee, 0)}
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "feather"]} size="sm" className="mr-1" fixedWidth/>{"Weight"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {Formatter.formatValue(data_request.weight, 0)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateRadCard(data_request) {
        let retrievals;
        if (data_request.txn_kind === "HTTP-GET") {
            retrievals = data_request.retrieve.map(function(data){
                return([
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "link"]} size="sm" className="mr-1" fixedWidth/>{"URL"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {data.url}
                        </td>
                    </tr>,
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "scroll"]} size="sm" className="mr-1" fixedWidth/>{"Script"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {data.script}
                        </td>
                    </tr>
                ]);
            })
        } else if (data_request.txn_kind === "RNG") {
            retrievals =
                <tr style={{"line-height": "20px"}}>
                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                        <FontAwesomeIcon icon={["fas", "link"]} size="sm" className="mr-1" fixedWidth/>{"Source"}
                    </td>
                    <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                        {"RNG request"}
                    </td>
                </tr>;
        }
        return (
            <Container className="mr-0 ml-0 p-0">
                <Table style={{"marginBottom": "0px"}}>
                    <tbody>
                        {retrievals}
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "calculator"]} size="sm" className="mr-1" fixedWidth/>{"Aggregate"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {data_request.aggregate}
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "calculator"]} size="sm" className="mr-1" fixedWidth/>{"Tally"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {data_request.tally}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    render() {
        console.log(this.props.data);

        return (
            <Container fluid className="pl-0 pr-0 mt-2">
                <Row>
                    <Col className="col mb-3">
                        <Card className="w-100 h-100 shadow p-1 mb-3 bg-white rounded">
                            <Card.Body className="pt-3 pl-3 pb-0">
                                <Card.Text>
                                    {this.generateTransactionCard(this.props.data)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="col mb-3">
                        <Card className="w-100 h-100 shadow p-1 mb-3 bg-white rounded">
                            <Card.Body className="pt-3 pl-3 pb-0">
                                <Card.Text>
                                    {this.generateDataRequestCard(this.props.data)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                            <Card.Body className="p-3">
                                <Card.Text>
                                    <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"35vh"}>
                                        {this.generateRadCard(this.props.data)}
                                    </Scrollbars>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}
