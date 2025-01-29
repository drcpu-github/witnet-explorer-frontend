import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DataRequestRadScript from "./DataRequestRadScript";

import Formatter from "../../../Services/Formatter";
import TimeConverter from "../../../Services/TimeConverter"

export default class DataRequest extends Component {
     generateTransactionCard(transaction) {
        var  transaction_link = "/search/" + transaction.hash;
        var DRO_hash_link = "/search/" + transaction.DRO_bytes_hash;
        var RAD_hash_link = "/search/" + transaction.RAD_bytes_hash;
        var block_link = "/search/" + transaction.block;
        return (
            <Table responsive>
                <tbody>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" />
                        </td>
                        <td className="custom-td">{"Transaction"}</td>
                        <td className="custom-td text-start">
                            <Link to={ transaction_link}>{transaction.hash}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" />
                        </td>
                        <td className="custom-td">{"DRO hash"}</td>
                        <td className="custom-td text-start">
                            <Link to={DRO_hash_link}>{transaction.DRO_bytes_hash}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" />
                        </td>
                        <td className="custom-td">{"RAD hash"}</td>
                        <td className="custom-td text-start">
                            <Link to={RAD_hash_link}>{transaction.RAD_bytes_hash}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "cubes"]} size="sm" />
                        </td>
                        <td className="custom-td">{"Block"}</td>
                        <td className="custom-td text-start">
                            <Link to={block_link}>{transaction.block}</Link>
                        </td>
                    </tr>
                    {
                        transaction.input_addresses.map(function(address, idx) {
                            var address_link = "/search/" + address;
                            if (idx === 0) {
                                return (
                                    <tr>
                                        <td className="custom-td">
                                            <FontAwesomeIcon icon={["fas", "user"]} size="sm"/>
                                        </td>
                                        <td className="custom-td">{"Addresses"}</td>
                                        <td className="custom-td text-start">
                                            <Link to={address_link}>{address}</Link>
                                        </td>
                                    </tr>
                                );
                            }
                            else {
                                return (
                                    <tr>
                                        <td className="custom-td text-start">
                                            <Link to={address_link}>{address}</Link>
                                        </td>
                                    </tr>
                                );
                            }
                        })
                    }
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["far", "clock"]} size="sm" />
                        </td>
                        <td className="custom-td">{"Timestamp"}</td>
                        <td className="custom-td text-start">
                            {TimeConverter.convertUnixTimestamp(transaction.timestamp, "full") + " (epoch: " + transaction.epoch + ")"}
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "check"]} size="sm"/>
                        </td>
                        <td className="custom-td">{"Status"}</td>
                        <td className="custom-td text-start">
                            {
                                transaction.confirmed
                                    ? "Confirmed"
                                    : "Mined"
                            }
                        </td>
                    </tr>
                </tbody>
            </Table>
        );
    }

     generateDataRequestCard(data_request) {
        return (
            <Table responsive>
                <tbody>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "search"]} size="sm" fixedWidth/>
                        </td>
                        <td className="custom-td">{"Witnesses"}</td>
                        <td className="custom-td text-start">
                            {data_request.witnesses}
                        </td>
                    </tr>
                    <tr>
                    <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "trophy"]} size="sm"/>
                        </td>
                        <td className="custom-td">{"Reward"}</td>
                        <td className="custom-td text-start">
                            {Formatter.formatWitValue(data_request.witness_reward, 2)}
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["far", "handshake"]} size="sm" />
                        </td>
                        <td className="custom-td">{"Collateral"}</td>
                        <td className="custom-td text-start">
                            {Formatter.formatWitValue(data_request.collateral, 2)}
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "percentage"]} size="sm"/>
                        </td>
                        <td className="custom-td">{"Consensus"}</td>
                        <td className="custom-td text-start">
                            {data_request.consensus_percentage + "%"}
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm"/>
                        </td>
                        <td className="custom-td">{"Miner fee"}</td>
                        <td className="custom-td text-start">
                            {Formatter.formatWitValue(data_request.miner_fee, 2)}
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "tachometer-alt"]} size="sm" />
                        </td>
                        <td className="custom-td">{"Priority"}</td>
                        <td className="custom-td text-start">
                            {Formatter.formatValueReducingDecimals(data_request.priority, 3)}
                        </td>
                    </tr>
                    <tr>
                        <td className="custom-td">
                            <FontAwesomeIcon icon={["fas", "feather"]} size="sm" />
                        </td>
                        <td className="custom-td">{"Weight"}</td>
                            <td className="custom-td text-start">
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
                                {this.generateTransactionCard(this.props.data)}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="col mb-3">
                        <Card className="w-100 h-100 shadow p-1 mb-3 bg-white rounded">
                            <Card.Body className="pt-3 pl-3 pb-0">
                                {this.generateDataRequestCard(this.props.data)}
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
