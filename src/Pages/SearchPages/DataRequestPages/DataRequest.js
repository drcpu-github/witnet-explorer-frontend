import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DataRequestRadScript from "./DataRequestRadScript";

import Formatter from "../../../Services/Formatter";
import TimeConverter from "../../../Services/TimeConverter"

export default class DataRequest extends Component {
     generateTransactionCard(transaction) {
        var txn_link = "/search/" + transaction.txn_hash;
        var data_request_bytes_hash_link = "/search/" + transaction.data_request_bytes_hash;
        var RAD_bytes_hash_link = "/search/" + transaction.RAD_bytes_hash;
        var block_link = "/search/" + transaction.block_hash;
        return (
            <Table style={{"marginBottom": "0px"}}>
                <tbody>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Transaction"}
                        </td>
                        <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={txn_link}>{transaction.txn_hash}</Link>
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Bytes hash"}
                        </td>
                        <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={data_request_bytes_hash_link}>{transaction.data_request_bytes_hash}</Link>
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"RAD hash"}
                        </td>
                        <td class="cell-fit-no-padding cell-truncate" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={RAD_bytes_hash_link}>{transaction.RAD_bytes_hash}</Link>
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
                    {
                        transaction.addresses.map(function(address, idx){
                            var address_link = "/search/" + address;
                            if (idx === 0) {
                                return (
                                    <tr style={{"line-height": "20px"}}>
                                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                            <FontAwesomeIcon icon={["fas", "user"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Addresses"}
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
                            <FontAwesomeIcon icon={["far", "clock"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Timestamp"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {TimeConverter.convertUnixTimestamp(transaction.txn_time, "full") + " (epoch: " + transaction.txn_epoch + ")"}
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
                    <tr style={{"line-height": "20px"}}/>
                </tbody>
            </Table>
        );
    }

     generateDataRequestCard(data_request) {
        return (
            <Table style={{"marginBottom": "0px"}}>
                <tbody>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "search"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Witnesses"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {data_request.witnesses}
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "trophy"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Reward"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {Formatter.formatWitValue(data_request.witness_reward, 0)}
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["far", "handshake"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Collateral"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {Formatter.formatWitValue(data_request.collateral, 2)}
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "percentage"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Consensus"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {data_request.consensus_percentage + "%"}
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Fee"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {Formatter.formatWitValue(data_request.commit_and_reveal_fee, 0)}
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "feather"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Weight"}
                        </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {Formatter.formatValue(data_request.weight, 0)}
                        </td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    render() {
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
                                    <Container fluid style={{ "padding": "0", "maxHeight": "40vh", "display": "block", "overflow": "auto" }}>
                                        <DataRequestRadScript data_request={this.props.data}/>
                                    </Container>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}
