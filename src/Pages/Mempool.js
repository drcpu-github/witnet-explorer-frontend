import React, { Component } from "react";
import { Card, Container, Spinner, Tab, Tabs } from "react-bootstrap";
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis, Label, Tooltip } from "recharts";

import ErrorCard from "../Components/ErrorCard";

import DataService from "../Services/DataService";
import TimeConverter from "../Services/TimeConverter";

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        var total_transactions = payload.reduce((a, v) => a = a + v.value, 0);
        return (
            <div className="custom-tooltip">
                <p className="label" style={{ "margin": 0 }}>{`${TimeConverter.convertUnixTimestamp(label, "hour")}  ${total_transactions} transaction(s)`}</p>
                {
                    payload.reverse().map(function (txn_fee) {
                        return (
                            <p className="label" style={{ "margin": 0 }}>{`${txn_fee.value} transaction(s) with priority ${txn_fee.name}`}</p>
                        );
                    })
                }
            </div>
        );
    }
    return null;
}

export default class Mempool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error_value: "",
            mempool_data_requests: null,
            mempool_value_transfers: null,
        }

        this.getMempool = this.getMempool.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        this.getMempool("data_requests");
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    handleSelect(tab) {
        if (tab === "data_requests" && this.state.mempool_data_requests === null) {
            this.getMempool("data_requests");
        }
        else if (tab === "value_transfers" && this.state.mempool_value_transfers === null) {
            this.getMempool("value_transfers");
        }
    }

    getMempool(transaction_type) {
        DataService.getMempool(transaction_type)
        .then(response => {
            if (transaction_type === "data_requests") {
                this.setState({
                    error_value: "",
                    mempool_data_requests: response,
                });
            }
            else if (transaction_type === "value_transfers") {
                this.setState({
                    error_value: "",
                    mempool_value_transfers: response,
                });
            }
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value: "Could not fetch pending transactions!"
            });
        });
    }

    generateMempoolChart(mempool) {
        var colors = ["#f94144", "#f3722c", "#8961e0", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1"];

        // Get all unique fees
        var unique_fees = new Set();
        mempool.forEach(entry => {
            entry.fee.forEach(fee => unique_fees.add(fee));
        });

        // Bucketize fees to get a smoother graph
        var fees = [...unique_fees].sort();
        var mapped_fees = {0: 0};
        var bar_fees = new Set();
        if (fees.length > 9) {
            var bucket = fees.length / 9;
            fees.forEach(function(fee, idx){
                var bucket_fee = parseInt(fees[Math.floor((Math.floor(idx / bucket) + 1) * bucket - 1)]);
                bar_fees.add(bucket_fee);
                mapped_fees[fee] = bucket_fee;
            });
        }
        else {
            fees.forEach(function(fee) {
                bar_fees.add(parseInt(fee));
                mapped_fees[fee] = parseInt(fee);
            });
        }
        bar_fees = [...bar_fees].sort(function (a, b) { return a - b; });

        // Build a bar for each bucketized fee
        var bars = bar_fees.map(function (fee, idx) {
            return <Bar
                dataKey={mapped_fees[fee]}
                stackId="1"
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                isAnimationActive={false}
            />;
        });

        // Create a mapping of fees to amounts (+ timestamp)
        var timestamp_fee_amount = mempool.map(function(entry) {
            var entry_to_dict = {"timestamp": entry.timestamp};
            entry.fee.forEach(function(fee, idx) {
                if (!(mapped_fees[fee] in entry_to_dict)) {
                    entry_to_dict[mapped_fees[fee]] = 0;
                }
                entry_to_dict[mapped_fees[fee]] += entry.amount[idx];
            });
            return entry_to_dict;
        });

        return (
            <Card style={{ "height": "75vh", "marginTop": "1rem", "border": "none" }}>
                <Card.Body>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timestamp_fee_amount} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" tick={false} label="Time" />
                            <YAxis>
                                <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
                                    {"Transactions"}
                                </Label>
                            </YAxis>
                            <Tooltip content={<CustomTooltip />} />
                            {bars}
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    render() {
        const { error_value, mempool_data_requests, mempool_value_transfers } = this.state;

        if (error_value === "") {
            return (
                <Container fluid>
                    <Card className="w-100 shadow p-1 mb-3 bg-white rounded" style={{ height: "85vh" }}>
                        <Card.Body style={{ "paddingTop": "0.5rem" }}>
                            <Tabs defaultActiveKey="data_requests" id="uncontrolled-tab-example" onSelect={this.handleSelect}>
                                <Tab eventKey="data_requests" title="Data requests">
                                    {
                                        mempool_data_requests === null
                                            ? <Spinner animation="border" />
                                            : this.generateMempoolChart(mempool_data_requests)
                                    }
                                </Tab>
                                <Tab eventKey="value_transfers" title="Value transfers">
                                    {
                                        mempool_value_transfers === null
                                            ? <Spinner animation="border" />
                                            : this.generateMempoolChart(mempool_value_transfers)
                                    }
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
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