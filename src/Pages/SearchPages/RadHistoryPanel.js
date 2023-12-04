import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Spinner, Tab, Table, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DataRequestRadScript from "./DataRequestPages/DataRequestRadScript";

import Paginator from "../../Components/Paginator";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class RadHistoryPanel extends Component {
    generateDetailsCard(pagination, data) {
        return (
            <Container fluid style={{ "paddingLeft": "0px", "paddingRight": "0px" }}>
                <Table responsive style={{ "marginBottom": "0px" }}>
                    <tbody>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["far", "file"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"History"}
                            </td>
                            <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                                {data.hash_type.replaceAll("_", " ")}
                            </td>
                        </tr>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"RAD hash"}
                            </td>
                            <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                                {data.hash}
                            </td>
                        </tr>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "search"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Matches"}
                            </td>
                            <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "100%" }}>
                                {pagination.total}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateDataRequestCard(data_requests) {
        return (
            <Container fluid style={{ "margin": "0.5rem 0 0 0.5rem", "padding-left": "0", "height": "45vh" }}>
                <Table hover responsive style={{ "display": "block", "overflow-y": "scroll", "height": "45vh" }}>
                    <thead style={{ "border": "none" }}>
                        <tr class="th-fixed">
                            <th class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                <FontAwesomeIcon icon={["far", "check"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Success"}
                            </th>
                            <th class="cell-fit-padding-wide">
                                <FontAwesomeIcon icon={["far", "clock"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Time"}
                            </th>
                            <th class="cell-fit-padding-wide">
                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Transaction"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                <FontAwesomeIcon icon={["fas", "search"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Witnesses"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                                <FontAwesomeIcon icon={["fas", "trophy"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Reward"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                                <FontAwesomeIcon icon={["far", "handshake"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Collateral"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                <FontAwesomeIcon icon={["fas", "percentage"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Consensus"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                <FontAwesomeIcon icon={["fas", "times"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Errors"}
                            </th>
                            <th class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                <FontAwesomeIcon icon={["fas", "bolt"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Liars"}
                            </th>
                            <th class="cell-fit-no-padding">
                                <FontAwesomeIcon icon={["far", "eye"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Result"}
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{"border": "none"}}>
                        {
                            data_requests.map(function(data_request) {
                                const transaction_link = "/search/" + data_request.data_request;

                                return (
                                    <tr>
                                        <td class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                            {
                                                data_request.success
                                                    ? <FontAwesomeIcon icon={["fas", "check"]} size="sm" fixedWidth />
                                                    : <FontAwesomeIcon icon={["fas", "times"]} size="sm" fixedWidth />
                                            }
                                        </td>
                                        <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "20%" }}>
                                            {TimeConverter.convertUnixTimestamp(data_request.timestamp, "full")}
                                        </td>
                                        <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                            <Link to={transaction_link}>{data_request.data_request}</Link>
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                            {data_request.witnesses}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                                            {Formatter.formatWitValue(data_request.reward, 2)}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                                            {Formatter.formatWitValue(data_request.collateral, 2)}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                            {data_request.consensus + "%"}
                                        </td>
                                        <td class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                            {data_request.num_errors}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{ "textAlign": "center" }}>
                                            {data_request.num_liars}
                                        </td>
                                        <td class="cell-fit-no-padding cell-truncate" style={{ "width": "30%" }}>
                                            {data_request.result}
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
            <Container fluid style={{ "padding": "0px" }}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-1">
                        <Card.Text>
                            {this.generateDetailsCard(this.props.pagination, this.props.data)}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded" style={{ "height": "60vh" }}>
                    <Card.Body className="p-1">
                        <Tabs defaultActiveKey="history" id="uncontrolled-tab-example">
                            <Tab eventKey="history" title="History">
                                {
                                    this.props.loading_next_page
                                        ? <Spinner animation="border" style={{ "margin": "1rem" }} />
                                        : this.generateDataRequestCard(this.props.data.history)
                                }
                            </Tab>
                            <Tab eventKey="rad_script" title="RAD script">
                                <Container fluid style={{ "marginTop": "1rem", "height": "45vh", "display": "block", "overflow-y": "scroll" }}>
                                    <DataRequestRadScript data_request={this.props.data.RAD_data} />
                                </Container>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                    <Card.Text style={{ "padding": "0.25rem 0.75rem 0.25rem 0", "position": "relative" }}>
                        <Paginator
                            key={"paginator-" + this.props.pagination.total}
                            items={this.props.pagination.total}
                            itemsPerPage={this.props.data.history.length}
                            pageStart={this.props.current_page}
                            onChangePage={this.props.page_callback}
                        />
                    </Card.Text>
                </Card>
            </Container>
        );
    }
}
