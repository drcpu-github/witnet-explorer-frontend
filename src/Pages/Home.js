import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HistoryTypeahead from "../Components/HistoryTypeahead"

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class Home extends Component{
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
            rows_per_card: Math.max(10, Math.floor(window.innerHeight * 0.45 / 20)),
        });
    }

    componentDidMount() {
        this.getHomePageData();

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        // run every 30 seconds
        this.interval_id = setInterval(this.getHomePageData, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    getHomePageData() {
        DataService.getHome()
        .then(response => {
            this.network_stats_card = this.generateNetworkStats(response.network_stats);
            this.supply_stats_card = this.generateSupplyInfo(response.supply_info);
            this.latest_blocks_card = this.generateLatestBlocks(response.latest_blocks);
            this.latest_data_requests_card = this.generateHashCard(response.latest_data_requests, ["fas", "align-justify"]);
            this.latest_value_transfers_card = this.generateHashCard(response.latest_value_transfers, ["fas", "coins"]);

            this.setState({
                update_timestamp : TimeConverter.convertUnixTimestamp(response.last_updated, "hour"),
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    generateNetworkStats(network_stats) {
        var table_rows = [
            [["fas", "history"], "Epochs elapsed", network_stats.epochs],
            [["fas", "cubes"], "Blocks minted", network_stats.num_blocks],
            [["fas", "align-justify"], "Data requests", network_stats.num_data_requests],
            [["fas", "coins"], "Value transfers", network_stats.num_value_transfers],
            [["fas", "desktop"], "Active nodes", network_stats.num_active_nodes],
            [["fas", "award"], "Reputed nodes", network_stats.num_reputed_nodes],
            [["far", "hourglass"], "Pending requests", network_stats.num_pending_requests]
        ];

        return (
            <Table responsive>
                <tbody>
                    {
                        table_rows.map(function(table_row) {
                            var icon = table_row[0];
                            var label = table_row[1];
                            var value = table_row[2];

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        <FontAwesomeIcon icon={icon} size="sm" style={{"marginRight": "0.25rem"}} fixedWidth/>{label}
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"border": "none", "textAlign": "right"}}>
                                        {Formatter.formatValue(value)}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateSupplyInfo(supply) {
        var table_rows = [
            [["fas", "hammer"], "WIT minted", (supply.blocks_minted_reward + supply.locked_wits_by_requests) / 1E9],
            [["fas", "fire"], "WIT burned", (supply.blocks_missing_reward + supply.supply_burned_lies) / 1E9],
            [["fas", "unlock"], "Circulating supply", supply.current_unlocked_supply / 1E9],
            [["fas", "lock"], "Time-locked supply", supply.current_locked_supply / 1E9],
            [["fas", "gem"], "Total supply", (supply.maximum_supply - supply.blocks_missing_reward) / 1E9]
        ];

        return (
            <Table responsive style={{"marginBottom": "0rem"}}>
                <tbody>
                    {
                        table_rows.map(function(table_row) {
                            var icon = table_row[0];
                            var label = table_row[1];
                            var value = table_row[2];

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        <FontAwesomeIcon icon={icon} size="sm" style={{"marginRight": "0.25rem"}} fixedWidth/>{label}
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"border": "none", "textAlign": "right"}}>
                                        {Formatter.formatValueSuffix(value, 2)}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateLatestBlocks(blocks) {
        return (
            <Table responsive style={{"marginBottom": "0px"}}>
                <tbody>
                    {
                        blocks.slice(0, this.state.rows_per_card).map(function(block) {
                            var block_link = "/search/" + block[0];

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit cell-truncate" style={{"border": "none", "width": "100%"}}>
                                        <FontAwesomeIcon icon={["fas", "cubes"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        <Link to={block_link}>{block[0]}</Link>
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        {block[1]}
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        <FontAwesomeIcon icon={["fas", "coins"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        {block[2]}
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"border": "none"}}>
                                        {TimeConverter.convertUnixTimestamp(block[3], "hour")}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateHashCard(hashes, icon) {
        return (
            <Table responsive style={{"marginBottom": "0px"}}>
                <tbody>
                    {
                        hashes.slice(0, this.state.rows_per_card).map(function(hash) {
                            var hash_link = "/search/" + hash[0];

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit cell-truncate" style={{"border": "none", "width": "100%"}}>
                                        <FontAwesomeIcon icon={icon} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        <Link to={hash_link}>{hash[0]}</Link>
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {TimeConverter.convertUnixTimestamp(hash[1], "hour")}
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"border": "none"}}>
                                        {
                                            hash[2]
                                                ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm"/>
                                                : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm"/>
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    render() {
        const { update_timestamp } = this.state;

        return(
            <Container fluid style={{paddingLeft: "50px", paddingRight: "50px"}}>
                <HistoryTypeahead/>
                <Row xs={1} md={2} lg={4}>
                    <Col>
                        <Card className="shadow pt-3 pb-2 pl-4 pr-4 mb-4 bg-white rounded">
                            <Card.Body style={{height: "50vh", padding: "0.75rem"}}>
                                <Card.Title style={{"marginBottom": "0.5rem"}}>
                                    <h5 style={{"marginBottom": "0.5rem"}}>
                                        Network stats
                                    </h5>
                                </Card.Title>
                                <Card.Text style={{"marginBottom": "0px"}}>
                                    {this.network_stats_card}
                                </Card.Text>
                                <Card.Title style={{"marginBottom": "0.5rem"}}>
                                    <h5 style={{"marginBottom": "0.5rem"}}>
                                        Supply info
                                    </h5>
                                </Card.Title>
                                <Card.Text style={{"marginBottom": "0px"}}>
                                    {this.supply_stats_card}
                                </Card.Text>
                            </Card.Body>
                            <Card.Text>
                                <small className="text-muted" style={{"marginLeft": "0.75rem"}}>
                                    Last updated: {update_timestamp}
                                </small>
                            </Card.Text>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow pt-3 pb-2 pl-4 pr-4 mb-4 bg-white rounded">
                            <Card.Body style={{height: "50vh", padding: "0.75rem"}}>
                                <Card.Title style={{"marginBottom": "0.5rem"}}>
                                    <h5 style={{"marginBottom": "0.5rem"}}>
                                        Blocks
                                    </h5>
                                </Card.Title>
                                <Card.Text>
                                    {this.latest_blocks_card}
                                </Card.Text>
                            </Card.Body>
                            <Card.Text>
                                <small className="text-muted" style={{"marginLeft": "0.75rem"}}>
                                    Last updated: {update_timestamp}
                                </small>
                            </Card.Text>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow pt-3 pb-2 pl-4 pr-4 mb-4 bg-white rounded">
                            <Card.Body style={{height: "50vh", padding: "0.75rem"}}>
                                <Card.Title style={{"marginBottom": "0.5rem"}}>
                                    <h5 style={{"marginBottom": "0.5rem"}}>
                                        Data requests
                                    </h5>
                                </Card.Title>
                                <Card.Text>
                                    {this.latest_data_requests_card}
                                </Card.Text>
                            </Card.Body>
                            <Card.Text>
                                <small className="text-muted" style={{"marginLeft": "0.75rem"}}>
                                    Last updated: {update_timestamp}
                                </small>
                            </Card.Text>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow pt-3 pb-2 pl-4 pr-4 mb-4 bg-white rounded">
                            <Card.Body style={{height: "50vh", padding: "0.75rem"}}>
                                <Card.Title style={{"marginBottom": "0.5rem"}}>
                                    <h5 style={{"marginBottom": "0.5rem"}}>
                                        Value transfers
                                    </h5>
                                </Card.Title>
                                <Card.Text>
                                    {this.latest_value_transfers_card}
                                </Card.Text>
                            </Card.Body>
                            <Card.Text>
                                <small className="text-muted" style={{"marginLeft": "0.75rem"}}>
                                    Last updated: {update_timestamp}
                                </small>
                            </Card.Text>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    };
}
