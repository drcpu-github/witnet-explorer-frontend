import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Col, Container, Row, Table } from "react-bootstrap";

import ErrorCard from "../Components/ErrorCard";
import Paginator from "../Components/Paginator";
import SingleAreaChart from "../Components/SingleAreaChart";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import TimeConverter from "../Services/TimeConverter";

export default class Reputation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            error_value: "",
            last_updated : "",
            window_width: 0,
            window_height: 0,
            rows_per_page: 0,
            current_page: 1,
            total_pages: 0,
            reputation_rows: [],
        }

        this.getReputation = this.getReputation.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    getReputation(epoch) {
        DataService.getReputation(epoch)
        .then(response => {
            var new_reputation_rows = this.generateReputationRows(response.reputation, response.total_reputation);
            this.reputation_chart = this.generateChart(response.reputation, "linear");
            this.setState({
                reputation_rows: new_reputation_rows,
                total_pages: Math.ceil(response.reputation.length / this.state.rows_per_page),
                loading : false,
                error_value : "",
                last_updated : TimeConverter.convertUnixTimestamp(response.last_updated, "full")
            });
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value : "Could not fetch reputation!"
            });
        });
    }

    generateReputationRows(reputations, total_reputation) {
        var reputation_rows = reputations.map(function(reputation){
            var api_link = "/search/" + reputation[0];
            var reputation_link = <Link to={api_link}>{reputation[0]}</Link>

            return (
                <tr style={{"line-height": "20px"}}>
                    <td className="cell-fit cell-truncate" style={{"width": "60%"}}>
                        {reputation_link}
                    </td>
                    <td className="cell-fit" style={{"textAlign": "center", "width": "20%"}}>
                        {reputation[1]}
                    </td>
                    <td className="cell-fit" style={{"textAlign": "center", "width": "20%"}}>
                        {reputation[2].toFixed(4) + "%"}
                    </td>
                </tr>
            );
        })

        return reputation_rows;
    }

    onChangePage(paginator) {
        this.setState({
            current_page: paginator.current_page
        });
    }

    generateReputationCard(){
        var row_start = (this.state.current_page - 1) * this.state.rows_per_page;
        var row_stop = this.state.current_page * this.state.rows_per_page;

        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        <Table hover responsive>
                            <thead>
                                <tr style={{"line-height": "25px"}}>
                                    <th className="cell-fit" style={{"width": "60%"}}>
                                        {"Addresses " + (row_start + 1) + " to " + row_stop}
                                    </th>
                                    <th className="cell-fit" style={{"textAlign": "center", "width": "20%"}}>
                                        {"Reputation"}
                                    </th>
                                    <th className="cell-fit" style={{"textAlign": "center", "width": "20%"}}>
                                        {"Eligibility"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reputation_rows.slice(row_start, row_stop)}
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
                <Card.Text style={{paddingLeft: "1.25rem", paddingRight: "1.25rem", position: "relative"}}>
                    <small className="text-muted" style={{position: "absolute", bottom: 0}}>
                        Last updated: {this.state.last_updated}
                    </small>
                    <Paginator key={"paginator-" + this.state.reputation_rows.length} items={this.state.reputation_rows.length} itemsPerPage={this.state.rows_per_page} pageStart={this.state.current_page} onChangePage={this.onChangePage}/>
                </Card.Text>
            </Card>
        );
    }

    generateChartCard(){
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    {this.reputation_chart}
                </Card.Body>
                <Card.Text style={{paddingLeft: "1.25rem", paddingRight: "1.25rem"}}>
                    <small className="text-muted">Last updated: {this.state.last_updated}</small>
                </Card.Text>
            </Card>
        );
    }

    generateChart(reputations, y_scale) {
        var i;
        var plot_reputation_data = [];
        for (i = 0; i < reputations.length; i++) {
            var return_value = {
                "Address": reputations[i][0],
                "Reputation": reputations[i][1]
            };
            plot_reputation_data.push(return_value);
        }
        return <SingleAreaChart data={plot_reputation_data} y_label="Reputation" y_scale={y_scale}/>;
    }

    updateWindowDimensions() {
        this.setState({
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            rows_per_page: Math.floor(window.innerHeight * 0.7 / 20)
        });
    }

    componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);

        let epoch = "";
        if (params.has("epoch")) {
            epoch = params.get("epoch");
        }

        this.getReputation(epoch);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    render() {
        const { loading, error_value } = this.state;

        let reputation_list_card, reputation_chart_card;
        if (error_value === "") {
            if (loading) {
                reputation_list_card = <SpinnerCard/>;
                reputation_chart_card = <SpinnerCard/>;
            }
            else{
                reputation_list_card = this.generateReputationCard();
                reputation_chart_card = this.generateChartCard();
            }
        }
        else {
            reputation_list_card = <ErrorCard errorValue={error_value}/>;
            reputation_chart_card = <ErrorCard errorValue={error_value}/>;
        }

        return(
            <Container fluid style={{"paddingLeft": "50px", "paddingRight": "50px"}}>
                <Row xs={1} md={2}>
                    <Col>
                        {reputation_list_card}
                    </Col>
                    <Col>
                        {reputation_chart_card}
                    </Col>
                </Row>
            </Container>
        );
    }
}
