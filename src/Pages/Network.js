import React, { Component } from "react";
import { Button, Card, Col, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import ErrorCard from "../Components/ErrorCard";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

const tab_request_map = {
    "data_requests": "histogram-data-requests",
    "composition": "histogram-data-request-composition",
    "witnesses": "histogram-data-request-witness",
    "collaterals": "histogram-data-request-collateral",
    "rewards": "histogram-data-request-reward",
    "lie_rates": "histogram-data-request-lie-rate",
    "trs": "histogram-trs-data",
    "value_transfers": "histogram-value-transfers",
    "staking": "percentile-staking-balances",
    "miners": "top-100-miners",
    "solvers": "top-100-data-request-solvers",
    "rollbacks": "list-rollbacks",
}

const colors = [
    "#0bb1a5",
    "#53378c",
    "#12243a",
    "#b10b17",
    "#a50bb1",
    "#b1a50b",
    "#8c5337",
    "#378c53",
]

export default class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            start_epoch: null,
            stop_epoch: null,
            error_value: null,
            period_data: null,
            aggregation: null,
            values: null,
            plot_data: null,
            last_updated: null,
            active_tab: "data_requests",
        }

        this.getNetwork = this.getNetwork.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.setStartEpoch = this.setStartEpoch.bind(this);
        this.setStopEpoch = this.setStopEpoch.bind(this);
    }

    getNetwork(key) {
        DataService.getNetwork(key, this.state.start_epoch, this.state.stop_epoch)
        .then(response => {
            this.setState({
                loading: false,
                error_value: null,
                period_data: response.period,
                aggregation: response.aggregation,
                values: response.values,
                plot_data: response.data,
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

    generateDataRequestsCard() {
        const period_data = this.state.period_data;
        var named_data = this.state.plot_data.map(function(data, idx) {
            return (
                {
                    "epochs": period_data[idx],
                    "data_requests_success": data[1],
                    "data_requests_failure": data[0] - data[1],
                }
            );
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body style={{ padding: 0, height: "70vh" }}>
                    <ResponsiveContainer width="100%">
                        <BarChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epochs" height={50} angle={-45} textAnchor="end" interval="preserveStart" tickFormatter={value => { return Formatter.formatValueSuffix(value, 2) }}>
                                <Label value="Epochs" position="insideBottom" textAnchor="middle" dy={15} />
                            </XAxis>
                            <YAxis width={50}>
                                <Label  value="Amount" angle={270} position="left" textAnchor="middle" />
                            </YAxis>
                            <Tooltip labelFormatter={(value) => value + " - " + (value + this.state.aggregation - 1)} />
                            <Bar name="Success" dataKey="data_requests_success" stackId="data_requests" fill="#0bb1a5" stroke="#0bb1a5" />
                            <Bar name="Failure" dataKey="data_requests_failure" stackId="data_requests" fill="#b10b17" stroke="#b10b17" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    generateCompositionCard() {
        const period_data = this.state.period_data;
        var named_data = this.state.plot_data.map(function(data, idx) {
            if (data[1] + data[2] === 0 || data[0] === 0) {
                return (
                    {
                        "epochs": period_data[idx],
                        "composition_http_get": 0,
                        "composition_http_post": 0,
                        "composition_rng": 0,
                    }
                );
            }
            else {
                return (
                    {
                        "epochs": period_data[idx],
                        "composition_http_get": data[1] / (data[1] + data[2]) * (data[0] - data[3]) / data[0] * 100,
                        "composition_http_post": data[2] / (data[1] + data[2]) * (data[0] - data[3]) / data[0] * 100,
                        "composition_rng": data[3] / data[0] * 100,
                    }
                );
            }
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body style={{ padding: 0, height: "70vh" }}>
                    <ResponsiveContainer width="100%">
                        <AreaChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epochs" height={50} angle={-45} textAnchor="end" interval="preserveStart" tickFormatter={value => { return Formatter.formatValueSuffix(value, 2) }}>
                                <Label value="Epochs" position="insideBottom" textAnchor="middle" dy={15} />
                            </XAxis>
                            <YAxis width={40} ticks={[0, 20, 40, 60, 80, 100]} domain={[0, 100]} tickFormatter={value => { return value + "%" }}>
                                <Label value="Ratio" angle={270} position="left" textAnchor="middle" />
                            </YAxis>
                            <Tooltip labelFormatter={(value) => value + " - " + (value + this.state.aggregation - 1)} formatter={(value) => value.toFixed(2) + "%"} />
                            <Area name="HTTP-GET" dataKey="composition_http_get" stackId="composition" fill="#0bb1a5" stroke="#0bb1a5" />
                            <Area name="HTTP-POST" dataKey="composition_http_post" stackId="composition" fill="#53378c" stroke="#53378c" />
                            <Area name="RNG" dataKey="composition_rng" stackId="composition" fill="#12243a" stroke="#12243a" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    generateValueMapCard(key, format_wit = false) {
        const period_data = this.state.period_data;
        var named_data = this.state.plot_data.map(function (data, idx) {
            var data_plus_epoch = data;
            data_plus_epoch["epochs"] = period_data[idx];
            return data_plus_epoch;
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body style={{ padding: 0, height: "70vh" }}>
                    <ResponsiveContainer width="100%">
                        <BarChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epochs" height={50} angle={-45} textAnchor="end" interval="preserveStart" tickFormatter={value => { return Formatter.formatValueSuffix(value, 2) }}>
                                <Label value="Epochs" position="insideBottom" textAnchor="middle" dy={15} />
                            </XAxis>
                            <YAxis width={50}>
                                <Label value={key} angle={270} position="left" textAnchor="middle" />
                            </YAxis>
                            <Tooltip labelFormatter={(value) => value + " - " + (value + this.state.aggregation - 1)}/>
                            {
                                this.state.values.map(function(value, idx){
                                    return (
                                        <Bar name={format_wit ? Formatter.formatWitValue(value) : value + " " + key.toLowerCase()} dataKey={value} stackId="stack" fill={colors[idx % colors.length]} stroke={colors[idx % colors.length]} />
                                    );
                                })
                            }
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    generateLieCard() {
        const period_data = this.state.period_data;
        var named_data = this.state.plot_data.map(function (data, idx) {
            if (data[0] === 0) {
                return (
                    {
                        "epochs": period_data[idx],
                        "truth": 0,
                        "error": 0,
                        "no_reveal": 0,
                        "no_consensus": 0,
                    }
                );
            }
            else {
                return (
                    {
                        "epochs": period_data[idx],
                        "truth": (data[0] - data.slice(1, 4).reduce((a, b) => a + b)) / data[0] * 100,
                        "error": data[1] / data[0] * 100,
                        "no_reveal": data[2] / data[0] * 100,
                        "no_consensus": data[3] / data[0] * 100,
                    }
                );
            }
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body style={{ padding: 0, height: "70vh" }}>
                    <ResponsiveContainer width="100%">
                        <AreaChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epochs" height={50} angle={-45} textAnchor="end" interval="preserveStart" tickFormatter={value => { return Formatter.formatValueSuffix(value, 2) }}>
                                <Label value="Epochs" position="insideBottom" textAnchor="middle" dy={15} />
                            </XAxis>
                            <YAxis width={40} ticks={[0, 20, 40, 60, 80, 100]} domain={[0, 100]} tickFormatter={value => { return value + "%" }}>
                                <Label value="Ratio" angle={270} position="left" textAnchor="middle" />
                            </YAxis>
                            <Tooltip labelFormatter={(value) => value + " - " + (value + this.state.aggregation - 1)} formatter={(value) => value.toFixed(2) + "%"} />
                            <Area name="Truth" dataKey="truth" stackId="lie_rate" fill="#0bb1a5" stroke="#0bb1a5" />
                            <Area name="Error" dataKey="error" stackId="lie_rate" fill="#53378c" stroke="#53378c" />
                            <Area name="No reveal" dataKey="no_reveal" stackId="lie_rate" fill="#12243a" stroke="#12243a" />
                            <Area name="No consensus" dataKey="no_consensus" stackId="lie_rate" fill="#b10b17" stroke="#b10b17" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    generateValueTransfersCard() {
        const period_data = this.state.period_data;
        var named_data = this.state.plot_data.map(function (data, idx) {
            return (
                {
                    "epochs": period_data[idx],
                    "value_transfers": data,
                }
            );
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body style={{ padding: 0, height: "70vh" }}>
                    <ResponsiveContainer width="100%">
                        <BarChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epochs" height={50} angle={-45} textAnchor="end" interval="preserveStart" tickFormatter={value => { return Formatter.formatValueSuffix(value, 2) }}>
                                <Label value="Epochs" position="insideBottom" textAnchor="middle" dy={15} />
                            </XAxis>
                            <YAxis width={50}>
                                <Label value="Amount" angle={270} position="left" textAnchor="middle" />
                            </YAxis>
                            <Tooltip labelFormatter={(value) => value + " - " + (value + this.state.aggregation - 1)} />
                            <Bar name="Value transfers" dataKey="value_transfers" fill="#0bb1a5" stroke="#0bb1a5" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    generateTrsCard() {
        const period_data = this.state.period_data;
        var named_data = this.state.plot_data.map(function (data, idx) {
            return (
                {
                    "epochs": period_data[idx],
                    "nodes": data[0],
                    "average_reputation": data[1],
                    "median_reputation": data[2],
                    "maximum_reputation": data[3],
                }
            );
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body class="flex-container" style={{ padding: 0 }}>
                    <div style={{ "box-sizing": "border-box", "width": "33%", height: "70vh" }}>
                        <ResponsiveContainer width="100%">
                            <BarChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="epochs" height={50} angle={-45} textAnchor="end" interval="preserveStart" tickFormatter={value => { return Formatter.formatValueSuffix(value, 2) }}>
                                    <Label value="Epochs" position="insideBottom" textAnchor="middle" dy={15} />
                                </XAxis>
                                <YAxis width={50}>
                                    <Label value="Nodes" angle={270} position="left" textAnchor="middle" />
                                </YAxis>
                                <Tooltip labelFormatter={(value) => value + " - " + (value + this.state.aggregation - 1)} formatter={(value) => value.toFixed(0)} />
                                <Bar name="Nodes" dataKey="nodes" fill="#0bb1a5" stroke="#0bb1a5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ "box-sizing": "border-box", "width": "calc(66% - 40px)", "margin-left": "40px", height: "70vh" }}>
                        <ResponsiveContainer width="100%">
                            <BarChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="epochs" height={50} angle={-45} textAnchor="end" interval="preserveStart" tickFormatter={value => { return Formatter.formatValueSuffix(value, 2) }}>
                                    <Label value="Epochs" position="insideBottom" textAnchor="middle" dy={15} />
                                </XAxis>
                                <YAxis width={50} scale="log" domain={['auto', 'auto']}>
                                    <Label value="Reputation" angle={270} position="left" textAnchor="middle" />
                                </YAxis>
                                <Tooltip labelFormatter={(value) => value + " - " + (value + this.state.aggregation - 1)} formatter={(value) => value.toFixed(0)} />
                                <Bar name="Average" dataKey="average_reputation" fill="#0bb1a5" stroke="#0bb1a5" />
                                <Bar name="Median" dataKey="median_reputation" fill="#53378c" stroke="#53378c" />
                                <Bar name="Maximum" dataKey="maximum_reputation" fill="#12243a" stroke="#12243a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    percentileFormat(value) {
        if (value === 11) {
            return value + "th percentile"
        }
        else if (value === 12) {
            return value + "th percentile"
        }
        else if (value % 10 === 1) {
            return value + "st percentile"
        }
        else if (value % 10 === 2) {
            return value + "nd percentile"
        }
        else if (value % 10 === 3) {
            return value + "rd percentile"
        }
        else {
            return value + "th percentile"
        }
    }

    generateStakingCard() {
        const value_data = this.state.values;
        var named_data = this.state.plot_data["ars"].map(function (data, idx) {
            return (
                {
                    "percentile": value_data[idx],
                    "balance": data,
                }
            );
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body style={{ padding: 0, height: "70vh" }}>
                    <ResponsiveContainer width="100%">
                        <AreaChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="percentile" angle={-45} textAnchor="end" interval={1} tickFormatter={value => value + "%"}>
                                <Label value="Percentile" position="insideBottom" textAnchor="middle" dy={20} />
                            </XAxis>
                            <YAxis width={100} tickFormatter={value => { return Formatter.formatWitValue(value, 0) }} scale="log" domain={['auto', 'auto']}>
                                <Label value="Staked balance" angle={270} position="left" textAnchor="middle" />
                            </YAxis>
                            <Tooltip labelFormatter={this.percentileFormat} formatter={(value) => Formatter.formatWitValue(value, 2)}/>
                            <Area type="monotone" name="ARS" dataKey="balance" fill="#0bb1a5" stroke="#0bb1a5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card >
        );
    }

    generateMinersSolversCard(address_type, amount_type) {
        var named_data = this.state.plot_data.map(function (data) {
            return (
                {
                    "address": data[0],
                    "amount": data[1],
                }
            );
        });

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body class="flex-container" style={{ padding: 0 }}>
                    <div style={{ "box-sizing": "border-box", "width": "66%", "height": "70vh" }}>
                        <ResponsiveContainer width="100%">
                            <AreaChart data={named_data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="address" tick={false} label={address_type} />
                                <YAxis>
                                    <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
                                        {amount_type}
                                    </Label>
                                </YAxis>
                                <Tooltip />
                                <Area type="monotone" name={amount_type} dataKey="amount" stroke="#0bb1a5" fill="#0bb1a5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ "box-sizing": "border-box", "width": "calc(33% - 40px)", "margin-left": "40px" }}>
                        <Table hover responsive style={{ "border-collapse": "separate", "display": "block", "height": "70vh", "overflow-y": "scroll" }}>
                            <thead>
                                <tr class="th-fixed">
                                    <th className="cell-fit">
                                        {address_type}
                                    </th>
                                    <th className="cell-fit" style={{ "textAlign": "right" }}>
                                        {amount_type}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.plot_data.map(function(table_row) {
                                        var address = table_row[0];
                                        var amount = table_row[1];

                                        return (
                                            <tr>
                                                <td class="cell-fit cell-truncate" style={{ "width": "100%" }}>
                                                    {address}
                                                </td>
                                                <td class="cell-fit" style={{ "textAlign": "right" }}>
                                                    {amount}
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    generateRollbackCard() {
        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px" }}>
                <Card.Body style={{ padding: 0, height: "70vh" }}>
                    <Table hover responsive style={{ "border-collapse": "separate", "display": "block", "height": "70vh", "overflow-y": "scroll", "margin": "0px" }}>
                        <thead>
                            <tr class="th-fixed">
                                <th style={{ "textAlign": "center", "border": "none", "padding": "0px 0px 0px 20px"}}>
                                    <FontAwesomeIcon icon={['fas', 'history']} style={{ "marginRight": "0.25rem" }} size="sm" />
                                    {"Timestamp"}
                                </th>
                                <th style={{ "textAlign": "center", "border": "none", "padding": "0px 0px 0px 20px" }}>
                                    <FontAwesomeIcon icon={['fas', 'history']} style={{ "marginRight": "0.25rem" }} size="sm" />
                                    {"Start epoch"}
                                </th>
                                <th style={{ "textAlign": "center", "border": "none", "padding": "0px 0px 0px 20px" }}>
                                    <FontAwesomeIcon icon={['fas', 'history']} style={{ "marginRight": "0.25rem" }} size="sm" />
                                    {"Stop epoch"}
                                </th>
                                <th style={{ "textAlign": "center", "border": "none", "padding": "0px 0px 0px 20px" }}>
                                    <FontAwesomeIcon icon={['fas', 'cubes']} style={{ "marginRight": "0.25rem" }} size="sm" />
                                    {"Length"}
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{ "border": "none" }}>
                            {
                                this.state.plot_data.map(function (data) {
                                    return (
                                        <tr>
                                            <td style={{ "textAlign": "right", "border": "none", "padding": "0px 0px 0px 20px" }}>
                                                {TimeConverter.convertUnixTimestamp(data[0], "full")}
                                            </td>
                                            <td style={{ "textAlign": "right", "border": "none", "padding": "0px 0px 0px 20px" }}>
                                                {data[1].toLocaleString("en-GB")}
                                            </td>
                                            <td style={{ "textAlign": "right", "border": "none", "padding": "0px 0px 0px 20px" }}>
                                                {data[2].toLocaleString("en-GB")}
                                            </td>
                                            <td style={{ "textAlign": "right", "border": "none", "padding": "0px 0px 0px 20px" }}>
                                                {data[3].toLocaleString("en-GB")}
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    }

    componentDidMount() {
        this.getNetwork(tab_request_map[this.state.active_tab]);
    }

    handleSelect(selected_key) {
        if (selected_key !== this.state.active_tab) {
            this.getNetwork(tab_request_map[selected_key]);
        }
        this.setState({
            active_tab: selected_key,
            loading: true,
        });
    }

    handleClick() {
        this.getNetwork(tab_request_map[this.state.active_tab]);
        this.setState({
            loading: true,
        });
    }

    setStartEpoch(change) {
        this.setState({
            start_epoch: change.target.value,
        });
    }

    setStopEpoch(change) {
        this.setState({
            stop_epoch: change.target.value,
        });
    }

    render() {
        const { loading, error_value, active_tab } = this.state;

        let data_card;
        if (error_value === null) {
            if (loading) {
                data_card = <SpinnerCard height="75vh"/>;
            }
            else {
                if (active_tab === "data_requests") {
                    data_card = this.generateDataRequestsCard();
                }
                else if (active_tab === "composition") {
                    data_card = this.generateCompositionCard();
                }
                else if (active_tab === "witnesses") {
                    data_card = this.generateValueMapCard("Witnesses");
                }
                else if (active_tab === "collaterals") {
                    data_card = this.generateValueMapCard("Collateral", true);
                }
                else if (active_tab === "rewards") {
                    data_card = this.generateValueMapCard("Reward", true);
                }
                else if (active_tab === "lie_rates") {
                    data_card = this.generateLieCard();
                }
                else if (active_tab === "value_transfers") {
                    data_card = this.generateValueTransfersCard();
                }
                else if (active_tab === "trs") {
                    data_card = this.generateTrsCard();
                }
                else if (active_tab === "staking") {
                    data_card = this.generateStakingCard();
                }
                else if (active_tab === "miners") {
                    data_card = this.generateMinersSolversCard("Miner", "Blocks");
                }
                else if (active_tab === "solvers") {
                    data_card = this.generateMinersSolversCard("Solver", "Data requests");
                }
                else if (active_tab === "rollbacks") {
                    data_card = this.generateRollbackCard();
                }
            }
        }
        else {
            data_card = <ErrorCard errorValue={error_value}/>;
        }

        return(
            <Container fluid>
                <Form>
                    <Row className="mb-1">
                        <Form.Group as={Col} id="start-epoch" md="3" className="mb-1">
                            <Form.Control type="text" placeholder="Start epoch" onChange={this.setStartEpoch}/>
                        </Form.Group>
                        <Form.Group as={Col} id="stop-epoch" md="3" className="mb-1">
                            <Form.Control type="text" placeholder="Stop epoch" onChange={this.setStopEpoch}/>
                        </Form.Group>
                        <Button as={Col} variant="outline-secondary" md="1" type="submit" className="mb-1" onClick={this.handleClick}>
                            Submit
                        </Button>
                    </Row>
                </Form>
                <Tabs defaultActiveKey="data_requests" id="network-tabs" onSelect={this.handleSelect}>
                    <Tab eventKey="data_requests" title="Data requests">
                        {data_card}
                    </Tab>
                    <Tab eventKey="composition" title="Composition">
                        {data_card}
                    </Tab>
                    <Tab eventKey="witnesses" title="Witnesses">
                        {data_card}
                    </Tab>
                    <Tab eventKey="collaterals" title="Collaterals">
                        {data_card}
                    </Tab>
                    <Tab eventKey="rewards" title="Rewards">
                        {data_card}
                    </Tab>
                    <Tab eventKey="lie_rates" title="Lie rates">
                        {data_card}
                    </Tab>
                    <Tab eventKey="value_transfers" title="Value transfers">
                        {data_card}
                    </Tab>
                    <Tab eventKey="trs" title="TRS">
                        {data_card}
                    </Tab>
                    <Tab eventKey="staking" title="Staking">
                        {data_card}
                    </Tab>
                    <Tab eventKey="miners" title="Miners">
                        {data_card}
                    </Tab>
                    <Tab eventKey="solvers" title="Solvers">
                        {data_card}
                    </Tab>
                    <Tab eventKey="rollbacks" title="Rollbacks">
                        {data_card}
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
