import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class MintPanel extends Component {
    generateDetailsCard(data) {
        var block_link = "/search/" + data.block_hash;
        var txn_link = "/search/" + data.txn_hash;

        return (
            <Table style={{"borderCollapse": "separate", "marginBottom": "0px"}}>
                <tbody>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "cubes"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Block"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={block_link}>{data.block_hash}</Link>
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Transaction"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            <Link to={txn_link}>{data.txn_hash}</Link>
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["far", "clock"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Time"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {TimeConverter.convertUnixTimestamp(data.txn_time, "full") + " (epoch: " + data.txn_epoch + ")"}
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "check"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Status"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {data.status}
                        </td>
                    </tr>
                    {
                        data.mint_outputs.map(function(output, idx){
                            var address_link = "/search/" + output[0];
                            console.log(Formatter.formatWitValue(output[1], 2).padStart(10, " "));
                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit-padding-wide">
                                        {
                                            idx === 0
                                                ? <span><FontAwesomeIcon icon={["fas", "coins"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Outputs"}</span>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit-no-padding">
                                        <span style={{"white-space": "pre"}}>
                                            {Formatter.formatWitValue(output[1], 2).padStart(10, " ")}
                                        </span>
                                        <span style={{"paddingLeft": "20px"}}>
                                            <FontAwesomeIcon icon={["fas", "long-arrow-alt-right"]} size="lg"/>
                                        </span>
                                        <span style={{"paddingLeft": "20px"}}>
                                            <Link to={address_link}>{output[0]}</Link>
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
                            <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"50vh"}>
                                <Container fluid>
                                    {this.generateDetailsCard(this.props.data)}
                                </Container>
                            </Scrollbars>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
