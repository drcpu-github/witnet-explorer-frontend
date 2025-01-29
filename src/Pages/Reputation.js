import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Label, Tooltip, Area } from 'recharts';

import ErrorCard from "../Components/ErrorCard";
import Paginator from "../Components/Paginator";
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
            this.reputation_chart = this.generateReputationChart(response.reputation);
            this.eligibility_chart = this.generateEligibilityChart(response.reputation);
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
            var api_link = "/search/" + reputation.address;
            var reputation_link = <Link to={api_link}>{reputation.address}</Link>

            return (
                <tr>
                    <td className="custom-td cell-truncate">
                        {reputation_link}
                    </td>
                    <td className="custom-td">
                        {reputation.reputation}
                    </td>
                    <td className="custom-td">
                        {reputation.eligibility.toFixed(4) + "%"}
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
            <Card className="shadow bg-white mb-4 rounded">
                <Card.Body>
                <Table responsive>
                    
                    <thead>
                        <tr style={{"line-height": "25px"}}>
                            <th className="custom-td">
                                {"Addresses " + (row_start + 1) + " to " + row_stop}
                            </th>
                            <th className="custom-td">
                                {"Reputation"}
                            </th>
                            <th className="custom-td">
                                {"Eligibility"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.reputation_rows.slice(row_start, row_stop)}
                    </tbody>
                </Table>
                <div className="card-section-spacer">
                    <Paginator key={"paginator-" + this.state.reputation_rows.length} items={this.state.reputation_rows.length} itemsPerPage={this.state.rows_per_page} pageStart={this.state.current_page} onChangePage={this.onChangePage}/>
                </div>
                </Card.Body>
                <Card.Text className="card-bottom-info">
                    <small>
                        Last updated: {this.state.last_updated}
                    </small>
                </Card.Text>
            </Card>
        );
    }

    generateReputationChart(reputations) {
        var plot_data = [];
        reputations.forEach(function(reputation) {
            plot_data.push({
                "Address": reputation.address,
                "Reputation": reputation.reputation,
            });
        });

        return (
            <ResponsiveContainer width="100%" height="50%">
                <AreaChart data={plot_data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Address" tick={false} label="Addresses" />
                    <YAxis scale="linear" domain={['auto', 'auto']}>
                        <Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
                            {"Reputation"}
                        </Label>
                    </YAxis>
                    <Tooltip />
                    <Area type="monotone" dataKey="Reputation" stroke="#03254c" fill="#03254c" />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    generateEligibilityChart(reputations) {
        var plot_data = [];
        reputations.forEach(function(reputation) {
            plot_data.push({
                "Address": reputation.address,
                "Eligibility": reputation.eligibility,
            });
        });

        return (
            <ResponsiveContainer width="100%" height="50%">
                <AreaChart data={plot_data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="Address" tick={false} label="Addresses"/>
                    <YAxis scale="linear" domain={['auto', 'auto']} tickFormatter={tick => tick + "%"}>
                        <Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
                            {"Eligibility"}
                        </Label>
                    </YAxis>
                    <Tooltip />
                    <Area type="monotone" dataKey="Eligibility" stroke="#03254c" fill="#03254c" />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    generateChartCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{ height: "85vh" }}>
                <Card.Body className="pt-3 pb-0">
                    {this.reputation_chart}
                    {this.eligibility_chart}
                </Card.Body>
                <Card.Text className="card-bottom-info">
                    <small>Last updated: {this.state.last_updated}</small>
                </Card.Text>
            </Card>
        );
    }

    updateWindowDimensions() {
        this.setState({
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            rows_per_page: Math.floor(window.innerHeight * 0.7 / 25)
        });
    }

    componentDidMount() {
        this.getReputation();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    render() {
        const { loading, error_value } = this.state;

        if (error_value === "") {
            return(
                <Container fluid style={{"paddingLeft": "50px", "paddingRight": "50px"}}>
                    <Row xs={1} md={2}>
                        <Col>
                            {
                                loading
                                    ? <SpinnerCard height="85vh" />
                                    : this.generateReputationCard()
                            }
                        </Col>
                        <Col>
                            {
                                loading
                                    ? <SpinnerCard height="85vh" />
                                    : this.generateChartCard()
                            }
                        </Col>
                    </Row>
                </Container>
            );
        }
        else {
            return (
                <Container fluid style={{ "padding": "0px" }}>
                    <ErrorCard errorValue={error_value} />;
                </Container>
            );
        }
    }
}
