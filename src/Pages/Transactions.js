import React, { Component } from "react";
import { Card, Container, Spinner, Tab, Tabs } from "react-bootstrap";
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis, Label, Tooltip } from "recharts";

import DataService from "../Services/DataService";
import TimeConverter from "../Services/TimeConverter";

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        var total_transactions = payload.reduce((a, v) =>  a = a + v.value , 0);
        return (
            <div className="custom-tooltip">
                <p className="label" style={{"margin": 0}}>{`${TimeConverter.convertUnixTimestamp(label, "hour")} - ${total_transactions} transaction(s)`}</p>
                {
                    payload.reverse().map(function(txn_fee){
                        return (
                            <p className="label" style={{"margin": 0}}>{`${txn_fee.value} transaction(s) with priority ${txn_fee.name}`}</p>
                        );
                    })
                }
            </div>
        );
    }
    return null;
}

export default class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            error_value: "",
            last_updated : "",
            pending_data_requests: [],
            data_request_fees: [],
            pending_value_transfers: [],
            value_transfer_fees: []
        }

        this.getPendingTransactions = this.getPendingTransactions.bind(this);
    }

    componentDidMount() {
        this.getPendingTransactions();
        // run every 300 seconds
        this.interval_id = setInterval(this.getPendingTransactions, 300000);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    getPendingTransactions() {
        DataService.getPendingTransactions()
        .then(response => {
            this.setState({
                loading: false,
                error_value: "",
                last_updated: TimeConverter.convertUnixTimestamp(response.last_updated, "hour"),
                pending_data_requests: response.pending_data_requests,
                data_request_fees: response.data_request_fees,
                pending_value_transfers: response.pending_value_transfers,
                value_transfer_fees: response.value_transfer_fees,
            });
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value : "Could not fetch pending transactions!"
            });
        });
    }

    generatePendingTransactionsChart(data, fees) {
        var colors = ["#f94144", "#f3722c", "#8961e0", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1"];

        var bars = fees.map(function(fee, idx){
            return <Bar
                dataKey={fee}
                stackId="1"
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                isAnimationActive={false}
            />;
        });

        return (
            <Card style={{"height": "75vh", "marginTop": "1rem", "border": "none"}}>
                <Card.Body>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{top: 10, right: 10, left: 10, bottom: 10}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="timestamp" tick={false} label="Time"/>
                            <YAxis>
                                <Label angle={270} position="left" style={{textAnchor: "middle"}}>
                                    {"Transactions"}
                                </Label>
                            </YAxis>
                            <Tooltip content={<CustomTooltip/>}/>
                            {bars}
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
                <Card.Text style={{paddingLeft: "1.25rem", paddingRight: "1.25rem"}}>
                    <small className="text-muted">Last updated: {this.state.last_updated}</small>
                </Card.Text>
            </Card>
        );
    }

    render() {
        const { loading, error_value } = this.state;

        let dataRequestPanel, valueTransferPanel;
        if (error_value === "") {
            if (loading) {
                dataRequestPanel = <Container fluid style={{"paddingTop": "1rem"}}><Spinner animation="border"/></Container>;
                valueTransferPanel = <Container fluid style={{"paddingTop": "1rem"}}><Spinner animation="border"/></Container>;
            }
            else {
                dataRequestPanel = this.generatePendingTransactionsChart(this.state.pending_data_requests, this.state.data_request_fees);
                valueTransferPanel = this.generatePendingTransactionsChart(this.state.pending_value_transfers, this.state.value_transfer_fees);
            }
        }
        else {
            dataRequestPanel = <Container fluid style={{"paddingTop": "1rem"}}>{error_value}</Container>;
            dataRequestPanel = <Container fluid style={{"paddingTop": "1rem"}}>{error_value}</Container>;
        }

        return(
            <Container fluid>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded" style={{height: "85vh"}}>
                    <Card.Body style={{"paddingTop": "0.5rem"}}>
                        <Tabs defaultActiveKey="data_request" id="uncontrolled-tab-example">
                            <Tab eventKey="data_request" title="Data requests">
                                {dataRequestPanel}
                            </Tab>
                            <Tab eventKey="value_transfer" title="Value transfers">
                                {valueTransferPanel}
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
