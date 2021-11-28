import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Col, Container, Row } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorCard from "../Components/ErrorCard";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import TimeConverter from "../Services/TimeConverter";

export default class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            error_value: "",
            rollback_rows: [],
            unique_miners: 0,
            unique_dr_solvers: 0,
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
                rollback_rows: this.generateRollbackRows(response.rollbacks),
                unique_miners: response.unique_miners,
                unique_dr_solvers: response.unique_dr_solvers,
                block_rows: this.generateNodeRows(response.top_100_miners, "blocks"),
                data_request_rows: this.generateNodeRows(response.top_100_dr_solvers, "dr_solvers"),
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

    generateRollbackRows(row_data) {
        return row_data.map(function(data){
            return (
                <Row>
                    <Col xs="auto" style={{paddingLeft: "20px"}}>
                        {TimeConverter.convertUnixTimestamp(data[0], "full")}
                    </Col>
                    <Col xs="auto" className="text-center" style={{paddingLeft: "20px"}}>
                        <FontAwesomeIcon icon={['fas', 'history']} size="sm"/>
                        {" "}
                        {data[1].toLocaleString("en-GB")}
                    </Col>
                    <Col xs="auto" className="text-center" style={{paddingLeft: "20px"}}>
                        <FontAwesomeIcon icon={['fas', 'history']} size="sm"/>
                        {" "}
                        {data[2].toLocaleString("en-GB")}
                    </Col>
                    <Col xs="auto" className="text-center" style={{paddingLeft: "20px"}}>
                        <FontAwesomeIcon icon={['fas', 'cubes']} size="sm"/>
                        {" "}
                        {data[3].toLocaleString("en-GB")}
                    </Col>
                </Row>
            );
        });
    }

    generateSummaryCard(unique_miners, unique_dr_solvers) {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "40vh"}}>
                <Card.Title style={{marginBottom: "0px", paddingLeft: "10px"}}>
                    <h5 style={{marginBottom: "0px"}}>
                        {"Node statistics"}
                    </h5>
                </Card.Title>
                <Card.Body style={{paddingTop: "10px", paddingBottom: "0px"}}>
                    <Card.Text>
                        <Row>
                            <Col xs={8} style={{paddingLeft: "20px"}}>
                                {"Nodes that mined at least 1 block"}
                            </Col>
                            <Col xs={2} className="text-center" style={{paddingLeft: "20px"}}>
                                {this.state.unique_miners.toLocaleString("en-GB")}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8} style={{paddingLeft: "20px"}}>
                                {"Nodes that solved at least 1 data request"}
                            </Col>
                            <Col xs={2} className="text-center" style={{paddingLeft: "20px"}}>
                                {this.state.unique_dr_solvers.toLocaleString("en-GB")}
                            </Col>
                        </Row>
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
        return row_data.map(function(data){
            var api_link = "/search/" + data[0];
            var address_link = <Link to={api_link}>{data[0]}</Link>

            return (
                <Row>
                    <Col xs="auto" style={{paddingLeft: "20px"}}>
                        {address_link}
                    </Col>
                    <Col xs="auto" className="text-center" style={{paddingLeft: "20px"}}>
                        {type === "blocks" 
                            ? <FontAwesomeIcon icon={['fas', 'cubes']} size="sm"/>
                            : <FontAwesomeIcon icon={['fas', 'align-justify']} size="sm"/>}
                        {" "}
                        {data[1].toLocaleString("en-GB")}
                    </Col>
                </Row>
            );
        });
    }

    generateRollbackCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "40vh"}}>
                <Card.Title style={{marginBottom: "0px", paddingLeft: "10px"}}>
                    <h5 style={{marginBottom: "0px"}}>
                        {"Most recent rollbacks"}
                    </h5>
                </Card.Title>
                <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"35vh"}>
                    <Card.Body style={{paddingTop: "10px", paddingBottom: "0px"}}>
                        <Card.Text>
                            {this.state.rollback_rows}
                        </Card.Text>
                    </Card.Body>
                </Scrollbars>
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
                <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"35vh"}>
                    <Card.Body style={{paddingTop: "10px", paddingBottom: "0px"}}>
                        <Card.Text>
                            {type === "blocks" ? this.state.block_rows : this.state.data_request_rows}
                        </Card.Text>
                    </Card.Body>
                </Scrollbars>
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
                <Row style={{paddingLeft: "50px", paddingRight: "50px", height: "43vh"}}>
                    <Col>
                        {rollback_card}
                    </Col>
                    <Col>
                        {summary_card}
                    </Col>
                </Row>
                <Row style={{paddingLeft: "50px", paddingRight: "50px", height: "43vh"}}>
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
