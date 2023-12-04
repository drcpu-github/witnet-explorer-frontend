import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class MintPanel extends Component {
    generateDetailsCard(data) {
        var transaction_link = "/search/" + data.hash;
        var miner_link = "/search/" + data.miner;
        var block_link = "/search/" + data.block;

        return (
            <Table style={{ "border-collapse": "separate", "margin-bottom": "0px" }}>
                <tbody style={{ "display": "block", "maxHeight": "75vh", "overflow-y": "scroll" }}>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Transaction"}
                        </td>
                        <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                            <Link to={transaction_link}>{data.hash}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                            <FontAwesomeIcon icon={["fas", "user"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Miner"}
                        </td>
                        <td style={{ "padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap" }}>
                            <a href={miner_link}>{data.miner}</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                            <FontAwesomeIcon icon={["fas", "cubes"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Block"}
                        </td>
                        <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                            <Link to={block_link}>{data.block}</Link>
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                            <FontAwesomeIcon icon={["far", "clock"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Time"}
                        </td>
                        <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                            {TimeConverter.convertUnixTimestamp(data.timestamp, "full") + " (epoch: " + data.epoch + ")"}
                        </td>
                    </tr>
                    <tr>
                        <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                            <FontAwesomeIcon icon={["fas", "check"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Status"}
                        </td>
                        <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                            {
                                data.confirmed
                                    ? "Confirmed"
                                    : "Mined"
                            }
                        </td>
                    </tr>
                    {
                        data.output_addresses.map(function (address, idx){
                            var address_link = "/search/" + address;
                            return (
                                <tr>
                                    <td class="cell-fit-padding-wide">
                                        {
                                            idx === 0
                                                ? <span><FontAwesomeIcon icon={["fas", "coins"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Outputs"}</span>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit-no-padding">
                                        <span style={{ "white-space": "pre" }}>
                                            {Formatter.formatWitValue(data.output_values[idx], 2).padStart(10, " ")}
                                        </span>
                                        <span style={{ "paddingLeft": "20px" }}>
                                            <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]} size="lg" />
                                        </span>
                                        <span style={{ "paddingLeft": "20px" }}>
                                            <Link to={address_link}>{address}</Link>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    render() {
        return (
            <Container fluid style={{"padding": "0px"}}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-1">
                        <Card.Text>
                            {this.generateDetailsCard(this.props.data)}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
