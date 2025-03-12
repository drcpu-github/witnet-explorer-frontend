import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";

import HistoryTypeahead from "../Components/HistoryTypeahead";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.getHomePageData = this.getHomePageData.bind(this);

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.state = {
            update_timestamp: "",
            window_width: 0,
            window_height: 0,
            rows_per_card: 0,
        };
    }

    updateWindowDimensions() {
        this.setState({
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            rows_per_card: Math.max(10, Math.floor((window.innerHeight * 0.45) / 20)),
        });
    }

    componentDidMount() {
        this.getHomePageData();

        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        // run every 30 seconds
        this.interval_id = setInterval(this.getHomePageData, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    getHomePageData() {
        DataService.getHome()
            .then((response) => {
                this.network_stats_card = this.generateNetworkStats(response.network_stats);
                this.supply_stats_card = this.generateSupplyInfo(response.supply_info);
                this.total_staked_card = this.generateTotalStakedCard(response.total_staked);
                this.latest_blocks_card = this.generateLatestBlocks(response.latest_blocks);
                this.latest_data_requests_card = this.generateTransactionCard(response.latest_data_requests);
                this.latest_value_transfers_card = this.generateTransactionCard(response.latest_value_transfers);
                this.latest_stakes_card = this.generateTransactionCard(response.latest_stakes);
                this.latest_unstakes_card = this.generateTransactionCard(response.latest_unstakes);

                this.setState({
                    update_timestamp: TimeConverter.convertUnixTimestamp(response.last_updated, "hour"),
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    generateNetworkStats(network_stats) {
        var table_rows = [
            [["fas", "network-wired"], "Validators", network_stats.validators],
            [["fas", "history"], "Epochs elapsed", network_stats.epochs],
            [["fas", "cubes"], "Blocks minted", network_stats.blocks],
            [["fas", "align-justify"], "Data requests", network_stats.data_requests],
            [["fas", "coins"], "Value transfers", network_stats.value_transfers],
            [["fas", "circle-plus"], "Stakes", network_stats.stakes],
            [["fas", "circle-minus"], "Unstakes", network_stats.unstakes],
            [["far", "hourglass"], "Pending transactions", network_stats.pending_requests],
        ];

        return (
            <Table responsive>
                <tbody>
                    {table_rows.map(function (table_row) {
                        var icon = table_row[0];
                        var label = table_row[1];
                        var value = table_row[2];

                        return (
                            <tr style={{ "line-height": "20px" }}>
                                <td class="cell-fit" style={{ border: "none" }}>
                                    <FontAwesomeIcon
                                        icon={icon}
                                        size="sm"
                                        style={{ marginRight: "0.25rem" }}
                                        fixedWidth
                                    />
                                    {label}
                                </td>
                                <td
                                    class="cell-fit-no-padding"
                                    style={{
                                        border: "none",
                                        textAlign: "right",
                                    }}
                                >
                                    {Formatter.formatValue(value)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    generateSupplyInfo(supply) {
        var table_rows = [
            [["fas", "hammer"], "WIT minted", (supply.blocks_minted_reward + supply.locked_wits_by_requests) / 1e9],
            [["fas", "fire"], "WIT burned", (supply.blocks_missing_reward + supply.supply_burned_lies) / 1e9],
            [["fas", "cubes-stacked"], "Staked supply", supply.current_staked_supply / 1e9],
            [["fas", "unlock"], "Circulating supply", supply.current_unlocked_supply / 1e9],
            [["fas", "lock"], "Time-locked supply", supply.current_locked_supply / 1e9],
        ];

        return (
            <Table responsive style={{ marginBottom: "0rem" }}>
                <tbody>
                    {table_rows.map(function (table_row) {
                        var icon = table_row[0];
                        var label = table_row[1];
                        var value = table_row[2];

                        return (
                            <tr style={{ "line-height": "20px" }}>
                                <td class="cell-fit" style={{ border: "none" }}>
                                    <FontAwesomeIcon
                                        icon={icon}
                                        size="sm"
                                        style={{ marginRight: "0.25rem" }}
                                        fixedWidth
                                    />
                                    {label}
                                </td>
                                <td
                                    class="cell-fit-no-padding"
                                    style={{
                                        border: "none",
                                        textAlign: "right",
                                    }}
                                >
                                    {Formatter.formatValueSuffix(value, 2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    generateTotalStakedCard(staked) {
        var ticks = [];
        var unique_day_ticks = new Set();
        staked.forEach(function(stake){
            var day = TimeConverter.convertUnixTimestamp(stake.timestamp, "day");
            if (!unique_day_ticks.has(day)) {
                unique_day_ticks.add(day);
                ticks.push(stake.timestamp);
            }
        });

        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staked} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        ticks={ticks}
                        tickFormatter={(tick) => TimeConverter.convertUnixTimestamp(tick, "day")}
                        angle={-35}
                        textAnchor="end"
                    />
                    <YAxis
                        scale="linear"
                        domain={["auto", "auto"]}
                        tickFormatter={(tick) => Formatter.formatValueSuffix(tick / 1e9, 2)}
                    />
                    <Tooltip
                        labelFormatter={(value) => TimeConverter.convertUnixTimestamp(value, "full")}
                        formatter={(value) => [Formatter.formatValueSuffix(value / 1e9, 2), "Staked"]}
                    />
                    <Area type="monotone" dataKey="staked" stroke="#03254c" fill="#03254c" />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    generateLatestBlocks(blocks) {
        return (
            <Table responsive style={{ marginBottom: "0px" }}>
                <tbody>
                    {blocks.slice(0, this.state.rows_per_card).map(function (block) {
                        var block_link = "/search/" + block.hash;

                        return (
                            <tr style={{ "line-height": "20px" }}>
                                <td
                                    class="cell-fit cell-truncate"
                                    style={{
                                        border: "none",
                                        width: "100%",
                                    }}
                                >
                                    <Link to={block_link}>{block.hash}</Link>
                                </td>
                                <td class="cell-fit-padding-tight" style={{ border: "none" }}>
                                    <FontAwesomeIcon
                                        icon={["fas", "align-justify"]}
                                        size="sm"
                                        style={{ marginRight: "0.20rem" }}
                                    />
                                    {block.data_request}
                                </td>
                                <td class="cell-fit-padding-tight" style={{ border: "none" }}>
                                    <FontAwesomeIcon
                                        icon={["fas", "coins"]}
                                        size="sm"
                                        style={{ marginRight: "0.20rem" }}
                                    />
                                    {block.value_transfer}
                                </td>
                                <td class="cell-fit-padding-tight" style={{ border: "none" }}>
                                    <FontAwesomeIcon
                                        icon={["fas", "circle-plus"]}
                                        size="sm"
                                        style={{ marginRight: "0.20rem" }}
                                    />
                                    {block.stake}
                                </td>
                                <td class="cell-fit-padding-tight" style={{ border: "none" }}>
                                    <FontAwesomeIcon
                                        icon={["fas", "circle-minus"]}
                                        size="sm"
                                        style={{ marginRight: "0.20rem" }}
                                    />
                                    {block.unstake}
                                </td>
                                <td class="cell-fit-no-padding" style={{ border: "none" }}>
                                    {TimeConverter.convertUnixTimestamp(block.timestamp, "hour")}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    generateTransactionCard(transactions) {
        return (
            <Table responsive style={{ marginBottom: "0px" }}>
                <tbody>
                    {transactions.slice(0, this.state.rows_per_card).map(function (transaction) {
                        var hash_link = "/search/" + transaction.hash;

                        return (
                            <tr style={{ "line-height": "20px" }}>
                                <td
                                    class="cell-fit cell-truncate"
                                    style={{
                                        border: "none",
                                        width: "100%",
                                    }}
                                >
                                    <Link to={hash_link}>{transaction.hash}</Link>
                                </td>
                                <td class="cell-fit" style={{ border: "none" }}>
                                    {TimeConverter.convertUnixTimestamp(transaction.timestamp, "hour")}
                                </td>
                                <td class="cell-fit-no-padding" style={{ border: "none" }}>
                                    {transaction.confirmed ? (
                                        <FontAwesomeIcon icon={["fas", "lock"]} size="sm" />
                                    ) : (
                                        <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" />
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    render() {
        return (
            <Container fluid style={{ height: "100%", paddingLeft: "30px", paddingRight: "30px" }}>
                <HistoryTypeahead lPad="20px" />
                <Container
                    fluid
                    style={{
                        "padding-left": "20px",
                        "padding-right": "20px",
                        "overflow-y": "scroll",
                        "max-height": "80vh",
                    }}
                >
                    <Row>
                        <Col xs={12} md={4} lg={3}>
                            <Row>
                                <Col xs={12}>
                                    <Card className="shadow pl-4 pr-4 mb-3 bg-white rounded">
                                        <Card.Body
                                            style={{
                                                height: "13rem",
                                                padding: "0.75rem",
                                            }}
                                        >
                                            <Card.Title style={{ marginBottom: "0.5rem" }}>
                                                <h5
                                                    style={{
                                                        marginBottom: "0.5rem",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    Network stats
                                                </h5>
                                            </Card.Title>
                                            <Card.Text style={{ marginBottom: "0px" }}>
                                                {this.network_stats_card}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12}>
                                    <Card className="shadow pl-4 pr-4 mb-3 bg-white rounded">
                                        <Card.Body
                                            style={{
                                                height: "10rem",
                                                padding: "0.75rem",
                                            }}
                                        >
                                            <Card.Title style={{ marginBottom: "0.5rem" }}>
                                                <h5
                                                    style={{
                                                        marginBottom: "0.5rem",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    Supply info
                                                </h5>
                                            </Card.Title>
                                            <Card.Text style={{ marginBottom: "0px" }}>
                                                {this.supply_stats_card}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} md={8} lg={9}>
                            <Card className="shadow pl-4 pr-4 mb-3 bg-white rounded">
                                <Card.Body style={{ height: "24rem", padding: "0.75rem" }}>
                                    <Card.Title style={{ marginBottom: "0.5rem" }}>
                                        <h5
                                            style={{
                                                marginBottom: "0.5rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            Total Staked
                                        </h5>
                                    </Card.Title>
                                    {this.total_staked_card}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4} lg={3}>
                            <Card className="shadow pl-4 pr-4 pb-2 mb-3 bg-white rounded">
                                <Card.Body style={{ height: "50vh", padding: "0.75rem" }}>
                                    <Card.Title style={{ marginBottom: "0.5rem" }}>
                                        <h5 style={{ marginBottom: "0.5rem", textAlign: "center" }}>Blocks</h5>
                                    </Card.Title>
                                    <Card.Text>{this.latest_blocks_card}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={8} lg={9}>
                            <Row>
                                <Col xs={12} md={3}>
                                    <Card className="shadow pl-4 pr-4 pb-2 mb-3 bg-white rounded">
                                        <Card.Body style={{ height: "50vh", padding: "0.75rem" }}>
                                            <Card.Title style={{ marginBottom: "0.5rem" }}>
                                                <h5 style={{ marginBottom: "0.5rem", textAlign: "center" }}>
                                                    Data requests
                                                </h5>
                                            </Card.Title>
                                            <Card.Text>{this.latest_data_requests_card}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12} md={3}>
                                    <Card className="shadow pl-4 pr-4 pb-2 mb-3 bg-white rounded">
                                        <Card.Body style={{ height: "50vh", padding: "0.75rem" }}>
                                            <Card.Title style={{ marginBottom: "0.5rem" }}>
                                                <h5 style={{ marginBottom: "0.5rem", textAlign: "center" }}>
                                                    Value transfers
                                                </h5>
                                            </Card.Title>
                                            <Card.Text>{this.latest_value_transfers_card}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12} md={3}>
                                    <Card className="shadow pl-4 pr-4 pb-2 mb-3 bg-white rounded">
                                        <Card.Body style={{ height: "50vh", padding: "0.75rem" }}>
                                            <Card.Title style={{ marginBottom: "0.5rem" }}>
                                                <h5 style={{ marginBottom: "0.5rem", textAlign: "center" }}>Stakes</h5>
                                            </Card.Title>
                                            <Card.Text>{this.latest_stakes_card}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={12} md={3}>
                                    <Card className="shadow pl-4 pr-4 pb-2 mb-3 bg-white rounded">
                                        <Card.Body style={{ height: "50vh", padding: "0.75rem" }}>
                                            <Card.Title style={{ marginBottom: "0.5rem" }}>
                                                <h5 style={{ marginBottom: "0.5rem", textAlign: "center" }}>
                                                    Unstakes
                                                </h5>
                                            </Card.Title>
                                            <Card.Text>{this.latest_unstakes_card}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Container>
        );
    }
}
