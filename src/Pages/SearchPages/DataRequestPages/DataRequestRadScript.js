import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class DataRequestRadScript extends Component {
    render() {
        const data_request = this.props.data_request;

        let retrievals = (
            data_request.retrieve.map(function(data){
                if (data.kind === "HTTP-GET" || data.kind === "HTTP-POST") {
                    // Add URL
                    var retrieval = [
                        <tr style={{ "line-height": "20px" }}>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "link"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"URL"}
                            </td>
                            <td style={{ "padding": "0px", "border": "none", "width": "100%", "word-break": "break-all" }}>
                                {data.url}
                            </td>
                        </tr>
                    ];
                    // Add headers if any
                    if (data.headers[0] !== "") {
                        data.headers.forEach(function (header) {
                            retrieval.push(
                                <tr style={{ "line-height": "20px" }}>
                                    <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                        <FontAwesomeIcon icon={["fas", "heading"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Header"}
                                    </td>
                                    <td style={{ "padding": "0px", "border": "none", "width": "100%", "word-break": "break-all" }}>
                                        {header}
                                    </td>
                                </tr>
                            );
                        })
                    }
                    // Add body if any
                    if (data.body !== "") {
                        retrieval.push(
                            <tr style={{ "line-height": "20px" }}>
                                <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                    <FontAwesomeIcon icon={["fas", "bold"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Body"}
                                </td>
                                <td style={{ "padding": "0px", "border": "none", "width": "100%", "word-break": "break-all" }}>
                                    {data.body}
                                </td>
                            </tr>
                        );
                    }
                    // Add script
                    retrieval.push(
                        <tr style={{ "line-height": "20px" }}>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "scroll"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Script"}
                            </td>
                            <td style={{ "padding": "0px", "border": "none", "width": "100%", "word-break": "break-all" }}>
                                {data.script}
                            </td>
                        </tr>
                    );
                    return retrieval;
                }
                else if (data.kind === "RNG") {
                    return (
                        <tr style={{"line-height": "20px"}}>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "link"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Source"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                {"RNG request"}
                            </td>
                        </tr>
                    );
                }
                else {
                    return ([]);
                }
            })
        );

        return (
            <Table style={{"marginBottom": "0px"}}>
                <tbody>
                    {retrievals}
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "calculator"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Aggregate"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {data_request.aggregate}
                        </td>
                    </tr>
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "calculator"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Tally"}
                        </td>
                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                            {data_request.tally}
                        </td>
                    </tr>
                </tbody>
            </Table>
        );
    }
}
