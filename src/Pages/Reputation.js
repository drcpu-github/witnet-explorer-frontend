import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Col, Container, Pagination, Row, Spinner, Table } from "react-bootstrap";

import SingleAreaChart from "../Components/SingleAreaChart";

import DataService from "../Services/DataService";
import TimeConverter from "../Services/TimeConverter";

export default class Reputation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            error_value: "",
            last_updated : "",
            current_page: 1,
            window_width: 0,
            window_height: 0,
            rows_per_page: 0,
            total_pages: 0,
            reputation_rows: []
        }

        this.onClick = this.onClick.bind(this);
        this.getReputation = this.getReputation.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    getReputation() {
        DataService.getReputation()
        .then(response => {
            this.reputation_panel = this.generateReputationRows(response.reputation, response.total_reputation);
            this.reputation_chart = this.generateChart(response.reputation, "linear");
            this.setState({
                loading : false,
                error_value : "",
                last_updated : TimeConverter.convertUnixTimestamp(response.last_updated, "hour")
            });
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value : "Could not fetch reputation!"
            });
        });
    }

    onClick(event) {
        if (event.target.id === "first") {
            this.setState({
                current_page: 1
            });
        }
        else if (event.target.id === "previous") {
            this.setState({
                current_page: this.state.current_page - 1
            });
        }
        else if (event.target.id === "next") {
            this.setState({
                current_page: this.state.current_page + 1
            });
        }
        else if (event.target.id === "last") {
            this.setState({
                current_page: this.state.total_pages
            });
        }
        else {
            this.setState({
                current_page: parseInt(event.target.id, 10)
            });
        }
    };

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
                        {(reputation[2] / total_reputation * 100).toFixed(4) + "%"}
                    </td>
                </tr>
            );
        })

        this.setState({
            reputation_rows: reputation_rows,
            total_pages: Math.ceil(reputations.length / this.state.rows_per_page)
        });
    }

    generateReputationCard(){
        var page_x = this.state.current_page < this.state.total_pages - 2 ? this.state.current_page : this.state.total_pages - 2;
        var page_y = this.state.current_page < this.state.total_pages - 2 ? this.state.current_page + 1: this.state.total_pages - 1;
        var page_z = this.state.current_page < this.state.total_pages - 2 ? this.state.current_page + 2 : this.state.total_pages;
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
                    <Pagination style={{float: "right", marginBottom: "0rem"}}>
                        <Pagination.Item id={"first"} onClick={this.onClick} disabled={this.state.current_page <= 1}>
                            {"<<"}
                        </Pagination.Item>
                        <Pagination.Item id={"previous"} onClick={this.onClick} disabled={this.state.current_page <= 1}>
                            {"<"}
                        </Pagination.Item>
                        <Pagination.Item id={page_x} onClick={this.onClick}>
                            {page_x}
                        </Pagination.Item>
                        <Pagination.Item id={page_y} onClick={this.onClick}>
                            {page_y}
                        </Pagination.Item>
                        <Pagination.Item id={page_z} onClick={this.onClick}>
                            {page_z}
                        </Pagination.Item>
                        <Pagination.Item id={"next"} onClick={this.onClick} disabled={this.state.current_page >= this.state.total_pages}>
                            {">"}
                        </Pagination.Item>
                        <Pagination.Item id={"last"} onClick={this.onClick} disabled={this.state.current_page >= this.state.total_pages}>
                            {">>"}
                        </Pagination.Item>
                    </Pagination>
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

    generateSpinnerCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        <Spinner animation="border" />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    generateErrorCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        <span>{this.state.error_value}</span>
                    </Card.Text>
                </Card.Body>
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
        this.getReputation();
        // run every 300 seconds
        this.interval_id = setInterval(this.getReputation, 300000);

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    render() {
        const { loading, error_value } = this.state;

        let reputation_list_card, reputation_chart_card;
        if (error_value === "") {
            if (loading) {
                reputation_list_card = this.generateSpinnerCard();
                reputation_chart_card = this.generateSpinnerCard();
            }
            else{
                reputation_list_card = this.generateReputationCard();
                reputation_chart_card = this.generateChartCard();
            }
        }
        else {
            reputation_list_card = this.generateErrorCard();
            reputation_chart_card = this.generateErrorCard();
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
