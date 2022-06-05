import React, { Component } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorCard from "../Components/ErrorCard";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            error_value: "",
            rollback_rows: [],
            miners: 0,
            data_request_solvers: 0,
            block_rows: [],
            data_request_rows: [],
            last_updated : "",
        }

        this.getNetwork = this.getNetwork.bind(this);
    }

    getNetwork() {
        DataService.getNetwork()
        .then(response => {
            this.setState({
                loading: false,
                error_value: "",
                rollback_rows: this.generateRollbackContainer(response.rollbacks),
                miners: response.miners,
                data_request_solvers: response.data_request_solvers,
                block_rows: this.generateNodeRows(response.miner_top_100, "blocks"),
                data_request_rows: this.generateNodeRows(response.data_request_solver_top_100, "dr_solvers"),
                average_ars_balance: Formatter.formatValueRound(response.average_ars_balance / 1E9, 0),
                average_reputed_balance: Formatter.formatValueRound(response.average_reputed_balance / 1E9, 0),
                last_updated: TimeConverter.convertUnixTimestamp(response.last_updated, "hour"),
            });
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value : "Could not fetch network statistics!"
            });
        });
    }

    generateRollbackContainer(row_data) {
        return (
            <Container fluid style={{"margin": "0rem", "padding": "0rem", "height": "30vh"}}>
                <Table responsive style={{"display": "block", "overflow": "auto", "height": "30vh"}}>
                    <tbody style={{"border": "none"}}>
                        {
                            row_data.map(function(data){
                                return(
                                    <tr>
                                        <td class="cell-fit-padding-wide" style={{"textAlign": "left"}}>
                                            {TimeConverter.convertUnixTimestamp(data[0], "full")}
                                        </td>
                                        <td class="padding-wide" style={{"textAlign": "center", "border": "none"}}>
                                            <span style={{"float": "left"}}>
                                                <FontAwesomeIcon icon={['fas', 'history']} style={{"marginRight": "0.25rem"}} size="sm"/>
                                            </span>
                                            <span style={{"float": "right"}}>
                                                {data[1].toLocaleString("en-GB")}
                                            </span>
                                        </td>
                                        <td class="padding-wide" style={{"textAlign": "center", "border": "none"}}>
                                            <span style={{"float": "left"}}>
                                                <FontAwesomeIcon icon={['fas', 'history']} style={{"marginRight": "0.25rem"}} size="sm"/>
                                            </span>
                                            <span style={{"float": "right"}}>
                                                {data[2].toLocaleString("en-GB")}
                                            </span>
                                        </td>
                                        <td class="padding-wide" style={{"textAlign": "center", "border": "none"}}>
                                            <span style={{"float": "left"}}>
                                                <FontAwesomeIcon icon={['fas', 'cubes']} style={{"marginRight": "0.25rem"}} size="sm"/>
                                            </span>
                                            <span style={{"float": "right"}}>
                                                {data[3].toLocaleString("en-GB")}
                                            </span>
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

    generateSummaryCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "40vh"}}>
                <Card.Title style={{marginBottom: "0px", paddingLeft: "10px"}}>
                    <h5 style={{marginBottom: "0px"}}>
                        {"Node statistics"}
                    </h5>
                </Card.Title>
                <Card.Body style={{paddingTop: "10px", paddingBottom: "0px"}}>
                    <Card.Text>
                        <Container fluid style={{"margin": "0rem", "padding": "0rem", "height": "30vh"}}>
                            <Table responsive style={{"display": "block", "overflow": "auto", "height": "30vh"}}>
                                <tbody>
                                    <tr>
                                        <td class="cell-fit">
                                            {"Nodes with at least 1 block mined"}
                                        </td>
                                        <td class="cell-fit" style={{ "textAlign": "right" }}>
                                            {this.state.miners.toLocaleString("en-GB")}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="cell-fit">
                                            {"Nodes with at least 1 data request solved"}
                                        </td>
                                        <td class="cell-fit" style={{ "textAlign": "right" }}>
                                            {this.state.data_request_solvers.toLocaleString("en-GB")}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="cell-fit">
                                            {"Average balance of ARS nodes"}
                                        </td>
                                        <td class="cell-fit" style={{ "textAlign": "right" }}>
                                            {this.state.average_ars_balance.toLocaleString("en-GB")}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="cell-fit">
                                            {"Average balance of reputed nodes"}
                                        </td>
                                        <td class="cell-fit" style={{ "textAlign": "right" }}>
                                            {this.state.average_reputed_balance.toLocaleString("en-GB")}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Container>
                    </Card.Text>
                </Card.Body>
                <Card.Text style={{padding: "0.75rem", position: "relative"}}>
                    <small className="text-muted" style={{position: "absolute", bottom: 0}}>
                        Last updated: {this.state.last_updated}
                    </small>
                </Card.Text>
            </Card>
        );
    }

    generateNodeRows(row_data, type) {
        return (
            <Container fluid style={{"margin": "0rem", "padding": "0rem", "height": "30vh"}}>
                <Table responsive style={{"display": "block", "overflow": "auto", "height": "30vh", "marginBottom": "0rem"}}>
                    <tbody>
                        {
                            row_data.map(function(data){
                                var api_link = "/search/" + data[0];
                                return (
                                    <tr>
                                        <td class="cell-fit">
                                            <a href={api_link}>{data[0]}</a>
                                        </td>
                                        <td class="padding-wide" style={{"border": "none"}}>
                                            <span style={{"float": "left"}}>
                                                {
                                                    type === "blocks"
                                                        ? <FontAwesomeIcon icon={['fas', 'cubes']} style={{"marginRight": "0.25rem"}} size="sm"/>
                                                        : <FontAwesomeIcon icon={['fas', 'align-justify']} style={{"marginRight": "0.25rem"}} size="sm"/>
                                                }
                                            </span>
                                            <span style={{"float": "right"}}>
                                                {data[1].toLocaleString("en-GB")}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        )
    }

    generateRollbackCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "40vh"}}>
                <Card.Title style={{marginBottom: "0px", paddingLeft: "10px"}}>
                    <h5 style={{marginBottom: "0px"}}>
                        {"Most recent rollbacks"}
                    </h5>
                </Card.Title>
                <Card.Body style={{paddingTop: "10px", paddingBottom: "0px"}}>
                    <Card.Text>
                        {this.state.rollback_rows}
                    </Card.Text>
                </Card.Body>
                <Card.Text style={{padding: "0.75rem", position: "relative"}}>
                    <small className="text-muted" style={{position: "absolute", bottom: 0}}>
                        Last updated: {this.state.last_updated}
                    </small>
                </Card.Text>
            </Card>
        );
    }

    generateMinerCard(type) {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "40vh"}}>
                <Card.Title style={{marginBottom: "0px", paddingLeft: "10px"}}>
                    <h5 style={{marginBottom: "0px"}}>
                        {type === "blocks" ? "Top 100 mining nodes" : "Top 100 data request solvers"}
                    </h5>
                </Card.Title>
                <Card.Body style={{paddingTop: "10px", paddingBottom: "0px"}}>
                    <Card.Text>
                        {type === "blocks" ? this.state.block_rows : this.state.data_request_rows}
                    </Card.Text>
                </Card.Body>
                <Card.Text style={{padding: "0.75rem", position: "relative"}}>
                    <small className="text-muted" style={{position: "absolute", bottom: 0}}>
                        Last updated: {this.state.last_updated}
                    </small>
                </Card.Text>
            </Card>
        );
    }

    componentDidMount() {
        this.getNetwork();
        // run every half hour
        this.interval_id = setInterval(this.getNetwork, 1800000);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    render() {
        const { loading, error_value } = this.state;

        let rollback_card, summary_card, block_card, data_request_card;
        if (error_value === "") {
            if (loading) {
                rollback_card = <SpinnerCard/>;
                summary_card = <SpinnerCard/>;
                block_card = <SpinnerCard/>;
                data_request_card = <SpinnerCard/>;
            }
            else{
                rollback_card = this.generateRollbackCard();
                summary_card = this.generateSummaryCard();
                block_card = this.generateMinerCard("blocks");
                data_request_card = this.generateMinerCard("data_requests");
            }
        }
        else {
            rollback_card = <ErrorCard errorValue={error_value}/>;
            summary_card = <ErrorCard errorValue={error_value}/>;
            block_card = <ErrorCard errorValue={error_value}/>;
            data_request_card = <ErrorCard errorValue={error_value}/>;
        }

        return(
            <Container fluid>
                <Row style={{paddingLeft: "50px", paddingRight: "50px", height: "44vh"}}>
                    <Col>
                        {rollback_card}
                    </Col>
                    <Col>
                        {summary_card}
                    </Col>
                </Row>
                <Row style={{paddingLeft: "50px", paddingRight: "50px", height: "44vh"}}>
                    <Col>
                        {block_card}
                    </Col>
                    <Col>
                        {data_request_card}
                    </Col>
                </Row>
            </Container>
        );
    }
}
