import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class RadHistoryPanel extends Component {
    generateDetailsCard(data) {
        return (
            <Container fluid style={{"paddingLeft": "0px", "paddingRight": "0px"}}>
                <Table responsive style={{"marginBottom": "0px"}}>
                    <tbody>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["far", "file"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Type"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {data.hash_type.replaceAll("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Hash"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {data.bytes_hash}
                            </td>
                        </tr>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "search"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Matches"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {data.num_data_requests}
                                {data.num_data_requests > 100
                                    ? " (" + data.history.length + " most recent are shown)"
                                    : ""
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateDataRequestCard(data_request_txns) {
        return (
            <Container fluid>
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["far", "check"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Success"}
                            </th>
                            <th class="cell-fit-padding-wide">
                                <FontAwesomeIcon icon={["far", "clock"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Time"}
                            </th>
                            <th class="cell-fit-padding-wide">
                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Transaction"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "search"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Witnesses"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["fas", "trophy"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Reward"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["far", "handshake"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Collateral"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "percentage"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Consensus"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "times"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Errors"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "bolt"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Liars"}
                            </th>
                            <th class="cell-fit-no-padding">
                                <FontAwesomeIcon icon={["far", "eye"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Result"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data_request_txns.map(function(data){
                                const txn_link = "/search/" + data[4];

                                return (
                                    <tr>
                                        <td class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                            {
                                                data[0] === "reverted"
                                                    ? <FontAwesomeIcon icon={["fas", "exclamation"]} size="sm" fixedWidth/>
                                                    : data[1] === true
                                                        ? <FontAwesomeIcon icon={["fas", "check"]} size="sm" fixedWidth/>
                                                        : <FontAwesomeIcon icon={["fas", "times"]} size="sm" fixedWidth/>
                                            }
                                        </td>
                                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "20%"}}>
                                            {TimeConverter.convertUnixTimestamp(data[2], "full")}
                                        </td>
                                        <td class="cell-fit-padding-wide cell-truncate" style={{"width": "30%"}}>
                                            <Link to={txn_link}>{data[4]}</Link>
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                            {data[5]}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{"textAlign": "right"}}>
                                            {Formatter.formatWitValue(data[6], 2)}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{"textAlign": "right"}}>
                                            {Formatter.formatWitValue(data[7], 2)}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                            {data[8] + "%"}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                            {data[9]}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{"textAlign": "center"}}>
                                            {data[10]}
                                        </td>
                                        <td class="cell-fit-no-padding cell-truncate" style={{"width": "30%"}}>
                                            {data[11]}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        );
    }

    render() {
        return (
            <Container fluid style={{"padding": "0px"}}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-1">
                        <Card.Text>
                            <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMin={"10vh"} autoHeightMax={"10vh"}>
                                {this.generateDetailsCard(this.props.data)}
                            </Scrollbars>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-1">
                        <Card.Text>
                            <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMin={"65vh"} autoHeightMax={"65vh"}>
                                {this.generateDataRequestCard(this.props.data.history)}
                            </Scrollbars>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
