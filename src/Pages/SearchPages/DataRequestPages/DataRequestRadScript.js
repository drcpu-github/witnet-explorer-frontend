import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class DataRequestRadScript extends Component {
    render() {
        const data_request = this.props.data_request;

        let retrievals;
        if (data_request.txn_kind === "HTTP-GET") {
            retrievals = data_request.retrieve.map(function(data){
                return([
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "link"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"URL"}
                        </td>
                        <td style={{"padding": "0px", "border": "none", "width": "100%", "word-break": "break-all"}}>
                            {data.url}
                        </td>
                    </tr>,
                    <tr style={{"line-height": "20px"}}>
                        <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                            <FontAwesomeIcon icon={["fas", "scroll"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Script"}
                        </td>
                        <td style={{"padding": "0px", "border": "none", "width": "100%", "word-break": "break-all"}}>
                            {data.script}
                        </td>
                    </tr>
                ]);
            })
        } else if (data_request.txn_kind === "RNG") {
            retrievals =
                <tr style={{"line-height": "20px"}}>
                    <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                        <FontAwesomeIcon icon={["fas", "link"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Source"}
                    </td>
                    <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                        {"RNG request"}
                    </td>
                </tr>;
        }

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
