import React, { Component } from "react";
import { Card, Col, Container, Row, Spinner, Tab, Table, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorCard from "../../Components/ErrorCard";
import Paginator from "../../Components/Paginator";

import DataService from "../../Services/DataService";
import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class AddressPanel extends Component {
    constructor(props) {
        super(props);

        this.loadData = this.loadData.bind(this);
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.onChangePage = this.onChangePage.bind(this);

        this.state = {
            address: props.address,
            details: null,
            info: null,
            value_transfers_pagination: null,
            value_transfers: null,
            blocks_pagination: null,
            blocks: null,
            mints_pagination: null,
            mints: null,
            data_requests_solved_pagination: null,
            data_requests_solved: null,
            data_requests_created_pagination: null,
            data_requests_created: null,
            current_page: 1,
            current_tab: "value-transfers",
            error_value: "",
        };

        if (this.state.address !== "") {
            this.loadData(this.state.address, "details", 1);
            this.loadData(this.state.address, "info", 1);
            this.loadData(this.state.address, "value-transfers", 1);
        }
    }

    handleTabSelect(tab) {
        this.setState({
            current_page: 1,
            current_tab: tab,
        });

        if (tab === "value-transfers" && this.state.value_transfers === null) {
            this.loadData(this.state.address, "value-transfers", 1);
        }
        else if (tab === "blocks" && this.state.blocks === null) {
            this.loadData(this.state.address, "blocks", 1);
        }
        else if (tab === "mints" && this.state.mints === null) {
            this.loadData(this.state.address, "mints", 1);
        }
        else if (tab === "data-requests-solved" && this.state.data_requests_solved === null) {
            this.loadData(this.state.address, "data-requests-solved", 1);
        }
        else if (tab === "data-requests-created" && this.state.data_requests_created === null) {
            this.loadData(this.state.address, "data-requests-created", 1);
        }
    }

    loadData(address, tab, page) {
        DataService.searchAddress(address, tab, page)
        .then(response => {
            if (tab === "details") {
                this.setState({
                    details: response,
                });
            }
            else if (tab === "info") {
                if (response.length === 1) {
                    this.setState({
                        info: response[0],
                    });
                }
                else
                {
                    this.setState({
                        info: {
                            "block": 0,
                            "value_transfer": 0,
                            "data_request": 0,
                            "commit": 0,
                        },
                    });
                }
            }
            else if (tab === "value-transfers") {
                this.setState({
                    value_transfers_pagination: JSON.parse(response[0].get("X-Pagination")),
                    value_transfers: response[1],
                });
            }
            else if (tab === "blocks") {
                this.setState({
                    blocks_pagination: JSON.parse(response[0].get("X-Pagination")),
                    blocks: response[1],
                });
            }
            else if (tab === "mints") {
                this.setState({
                    mints_pagination: JSON.parse(response[0].get("X-Pagination")),
                    mints: response[1],
                });
            }
            else if (tab === "data-requests-solved") {
                this.setState({
                    data_requests_solved_pagination: JSON.parse(response[0].get("X-Pagination")),
                    data_requests_solved: response[1],
                });
            }
            else if (tab === "data-requests-created") {
                this.setState({
                    data_requests_created_pagination: JSON.parse(response[0].get("X-Pagination")),
                    data_requests_created: response[1],
                });
            }
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value: "Could not find address!",
            });
        });
    }

    onChangePage(paginator) {
        this.setState({
            current_page: paginator.current_page,
        });

        if (this.state.current_page !== paginator.current_page) {
            this.setState({
                [this.state.current_tab.replace("-", "_")]: null,
            });
            this.loadData(this.state.address, this.state.current_tab, paginator.current_page);
        }
    }

    generateDetailsCard() {
        const { details } = this.state;

        var address_link = "/search/" + this.state.address;
        return (
            <Container fluid>
                <Table>
                    <tbody>
                        <tr>
                            <td style={{"padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap"}}>
                                <FontAwesomeIcon icon={["fas", "user"]} size="sm" fixedWidth style={{"marginRight": "0.25rem"}}/>{"Account"}
                            </td>
                            <td style={{"padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap"}}>
                                <a href={address_link}>{this.state.address}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style={{"padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap"}}>
                                <FontAwesomeIcon icon={["fas", "wallet"]} size="sm" fixedWidth style={{"marginRight": "0.25rem"}}/>{"Balance"}
                            </td>
                            <td style={{"padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap"}}>
                                {
                                    details.balance === "Could not retrieve balance"
                                        ? details.balance
                                        : Formatter.formatWitValue(details.balance)
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style={{"padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap"}}>
                                <FontAwesomeIcon icon={["fas", "star"]} size="sm" fixedWidth style={{"marginRight": "0.25rem"}}/>{"Reputation"}
                            </td>
                            <td style={{"padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap"}}>
                                {details.reputation}
                                {
                                    details.eligibility === "Could not retrieve eligibility"
                                        ? " (" + details.eligibility + ")"
                                        : " (" + (details.eligibility / details.total_reputation * 100).toFixed(2) + "%)"
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style={{ "padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap" }}>
                                <FontAwesomeIcon icon={["far", "id-card"]} size="sm" fixedWidth style={{ "marginRight": "0.25rem" }} />{"Label"}
                            </td>
                            <td style={{ "padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap" }}>
                                {details.label}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateInfoCard() {
        const { info } = this.state;

        return (
            <Container fluid>
                <Table>
                    <tbody>
                        <tr>
                            <td style={{ "padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap" }}>
                                <FontAwesomeIcon icon={["fas", "cubes"]} size="sm" fixedWidth style={{ "marginRight": "0.25rem" }} />{"Blocks"}
                            </td>
                            <td style={{ "padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap" }}>
                                {info.block}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ "padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap" }}>
                                <FontAwesomeIcon icon={["fas", "coins"]} size="sm" fixedWidth style={{ "marginRight": "0.25rem" }} />{"Value transfers"}
                            </td>
                            <td style={{ "padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap" }}>
                                {info.value_transfer}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ "padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap" }}>
                                <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" fixedWidth style={{ "marginRight": "0.25rem" }} />{"Data requests created"}
                            </td>
                            <td style={{ "padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap" }}>
                                {info.data_request}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ "padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap" }}>
                                <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" fixedWidth style={{ "marginRight": "0.25rem" }} />{"Data requests solved"}
                            </td>
                            <td style={{ "padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap" }}>
                                {info.commit}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateValueTransferCard() {
        const { value_transfers_pagination, value_transfers } = this.state;
        var total_value_transfers = value_transfers_pagination.total;

        return (
            <Container fluid style={{ height: "50vh", "padding": "0" }}>
                <Table
                    hover
                    responsive
                    style={{
                        "border-collapse": "separate",
                        "display": "block",
                        "height": "45vh",
                        "overflow-y": "scroll"
                    }}
                >
                    <thead>
                        <tr class="th-fixed">
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Transaction"}
                            </th>
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["far", "clock"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Timestamp"}
                            </th>
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["fas", "user"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Source"}
                            </th>
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["fas", "user"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Destination"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["fas", "coins"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Value"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Fee"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["fas", "tachometer-alt"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Priority"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "lock"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Locked"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            value_transfers.map(function(value_transfer){
                                const txn_link = "/search/" + value_transfer.hash;
                                const source_link = "/search/" + value_transfer.input_addresses[0];
                                const destination_link = "/search/" + value_transfer.output_addresses[0];

                                let icon;
                                // Merge or split transaction to the same address
                                if (value_transfer.direction === "self") {
                                    icon = <FontAwesomeIcon icon={["fas", "equals"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                }
                                // Incoming transaction
                                else if (value_transfer.direction === "in") {
                                    icon = <FontAwesomeIcon icon={["fas", "plus"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                }
                                // Outgoing transaction
                                else if (value_transfer.direction === "out") {
                                    icon = <FontAwesomeIcon icon={["fas", "minus"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                }

                                return (
                                    <tr>
                                        <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                            {icon}<a href={txn_link}>{value_transfer.hash}</a>
                                        </td>
                                        <td class="cell-fit">
                                            {TimeConverter.convertUnixTimestamp(value_transfer.timestamp, "full")}
                                        </td>
                                        <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                            {
                                                value_transfer.input_addresses.length === 1
                                                    ? <a href={source_link}>{value_transfer.input_addresses[0]}</a>
                                                    : value_transfer.input_addresses.length > 1
                                                        ? "multiple addresses"
                                                        : "genesis"
                                            }
                                        </td>
                                        <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                            {
                                                value_transfer.output_addresses.length === 1
                                                    ? <a href={destination_link}>{value_transfer.output_addresses[0]}</a>
                                                    : "multiple addresses"
                                            }
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "right"}}>
                                            {Formatter.formatWitValue(value_transfer.value, 2)}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "right"}}>
                                            {Formatter.formatWitValue(value_transfer.fee, 2)}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "right"}}>
                                            {Formatter.formatValue(value_transfer.priority, 0)}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "center"}}>
                                            {
                                                value_transfer.locked
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
                <Paginator
                    key={"paginator-" + total_value_transfers}
                    items={total_value_transfers}
                    itemsPerPage={value_transfers.length}
                    pageStart={this.state.current_page}
                    onChangePage={this.onChangePage}
                />
            </Container>
        );
    }

    generateBlocksCard() {
        const { blocks_pagination, blocks } = this.state;
        var total_blocks = blocks_pagination.total;

        return (
            <Container fluid style={{ height: "50vh", "padding": "0" }}>
                <Table
                    hover
                    responsive
                    style={{
                        "border-collapse": "separate",
                        "display": "block",
                        "height": "45vh",
                        "overflow-y": "scroll"
                    }}
                >
                    <thead>
                        <tr class="th-fixed">
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["fas", "cubes"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Block"}
                            </th>
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["far", "clock"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Timestamp"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["fas", "history"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Epoch"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["fas", "trophy"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Reward"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "right"}}>
                                <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Fees"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "coins"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Value transfer"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Data request"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["far", "handshake"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Commit"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["far", "eye"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Reveal"}
                            </th>
                            <th class="cell-fit" style={{"textAlign": "center"}}>
                                <FontAwesomeIcon icon={["fas", "calculator"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Tally"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            blocks.map(function(block) {
                                const block_link = "/search/" + block.hash;

                                return (
                                    <tr>
                                        <td class="cell-fit cell-truncate" style={{"width": "30%"}}>
                                            <a href={block_link}>{block.hash}</a>
                                        </td>
                                        <td class="cell-fit">
                                            {TimeConverter.convertUnixTimestamp(block.timestamp, "full")}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "right"}}>
                                            {block.epoch}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "right"}}>
                                            {Formatter.formatWitValue(block.block_reward)}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "right"}}>
                                            {Formatter.formatWitValue(block.block_fees)}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "center"}}>
                                            {block.value_transfers}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "center"}}>
                                            {block.data_requests}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "center"}}>
                                            {block.commits}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "center"}}>
                                            {block.reveals}
                                        </td>
                                        <td class="cell-fit" style={{"textAlign": "center"}}>
                                            {block.tallies}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <Paginator
                    key={"paginator-" + total_blocks}
                    items={total_blocks}
                    itemsPerPage={blocks.length}
                    pageStart={this.state.current_page}
                    onChangePage={this.onChangePage}
                />
            </Container>
        );
    }

    generateMintsCard() {
        const { mints_pagination, mints } = this.state;
        var total_mints = mints_pagination.total;

        return (
            <Container fluid style={{ height: "50vh", "padding": "0" }}>
                <Table
                    hover
                    responsive
                    style={{
                        "border-collapse": "separate",
                        "display": "block",
                        "height": "45vh",
                        "overflow-y": "scroll"
                    }}
                >
                    <thead>
                        <tr class="th-fixed">
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{ "marginRight": "0.25rem" }} />{"Transaction"}
                            </th>
                            <th class="cell-fit">
                                <FontAwesomeIcon icon={["far", "clock"]} size="sm" style={{ "marginRight": "0.25rem" }} />{"Timestamp"}
                            </th>
                            <th class="cell-fit" style={{ "textAlign": "right" }}>
                                <FontAwesomeIcon icon={["fas", "user"]} size="sm" style={{ "marginRight": "0.25rem" }} />{"Miner"}
                            </th>
                            <th class="cell-fit" style={{ "textAlign": "right" }}>
                                <FontAwesomeIcon icon={["fas", "trophy"]} size="sm" style={{ "marginRight": "0.25rem" }} />{"Value"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            mints.map(function (mint) {
                                const mint_link = "/search/" + mint.hash;
                                const miner_link = "/search/" + mint.miner;

                                return (
                                    <tr>
                                        <td class="cell-fit cell-truncate" style={{ "width": "50%" }}>
                                            <a href={mint_link}>{mint.hash}</a>
                                        </td>
                                        <td class="cell-fit">
                                            {TimeConverter.convertUnixTimestamp(mint.timestamp, "full")}
                                        </td>
                                        <td class="cell-fit">
                                            <a href={miner_link}>{mint.miner}</a>
                                        </td>
                                        <td class="cell-fit" style={{ "textAlign": "right" }}>
                                            {Formatter.formatWitValue(mint.output_value)}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <Paginator
                    key={"paginator-" + total_mints}
                    items={total_mints}
                    itemsPerPage={mints.length}
                    pageStart={this.state.current_page}
                    onChangePage={this.onChangePage}
                />
            </Container>
        );
    }

    generateDataRequestsSolvedCard() {
        const { data_requests_solved_pagination, data_requests_solved } = this.state;
        var total_data_requests_solved = data_requests_solved_pagination.total;

        return (
            <Container fluid style={{ height: "50vh", "padding": "0" }}>
                <Table
                    hover
                    responsive
                    style={{
                        "border-collapse": "separate",
                        "display": "block",
                        "height": "45vh",
                        "overflow-y": "scroll"
                    }}
                >
                <thead>
                    <tr class="th-fixed">
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "check"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Success"}
                        </th>
                        <th class="cell-fit" style={{ "width": "30%" }}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Data request"}
                        </th>
                        <th class="cell-fit">
                            <FontAwesomeIcon icon={["far", "clock"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Timestamp"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "right"}}>
                            <FontAwesomeIcon icon={["far", "handshake"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Collateral"}
                        </th>
                        <th class="cell-fit" style={{ "width": "30%" }}>
                            <FontAwesomeIcon icon={["far", "eye"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Result"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "times"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Error"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "bolt"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Liar"}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data_requests_solved.map(function(data_request_solved, idx){
                            const data_request_link = "/search/" + data_request_solved.hash;

                            return (
                                <tr>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_solved.success
                                                ? <FontAwesomeIcon icon={["fas", "check"]} size="sm"/>
                                                : <FontAwesomeIcon icon={["fas", "times"]} size="sm"/>
                                        }
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "30%"}}>
                                        <a href={data_request_link}>{data_request_solved.hash}</a>
                                    </td>
                                    <td class="cell-fit">
                                        {TimeConverter.convertUnixTimestamp(data_request_solved.timestamp, "full")}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request_solved.collateral)}
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "30%"}}>
                                        {data_request_solved.reveal}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_solved.error
                                                ? <FontAwesomeIcon icon={["fas", "times"]} size="sm"/>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_solved.liar
                                                ? <FontAwesomeIcon icon={["fas", "bolt"]} size="sm"/>
                                                : ""
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
                <Paginator
                    key={"paginator-" + total_data_requests_solved}
                    items={total_data_requests_solved}
                    itemsPerPage={data_requests_solved.length}
                    pageStart={this.state.current_page}
                    onChangePage={this.onChangePage}
                />
            </Container >
        );
    }

    generateDataRequestsCreatedCard() {
        const { data_requests_created_pagination, data_requests_created } = this.state;
        var total_data_requests_created = data_requests_created_pagination.total;

        return (
            <Container fluid style={{ height: "50vh", "padding": "0" }}>
                <Table
                    hover
                    responsive
                    style={{
                        "border-collapse": "separate",
                        "display": "block",
                        "height": "45vh",
                        "overflow-y": "scroll"
                    }}
                >
                <thead>
                    <tr class="th-fixed">
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "check"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Success"}
                        </th>
                        <th class="cell-fit" style={{ "width": "20%" }}>
                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Data request"}
                        </th>
                        <th class="cell-fit" style={{ "width": "20%" }}>
                            <FontAwesomeIcon icon={["far", "clock"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Timestamp"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "right"}}>
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Total fee"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "right"}}>
                            <FontAwesomeIcon icon={["fas", "search"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Witnesses"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "right"}}>
                            <FontAwesomeIcon icon={["far", "handshake"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Collateral"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "percentage"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Consensus"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "times"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Errors"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "bolt"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Liars"}
                        </th>
                        <th class="cell-fit" style={{ "width": "20%" }}>
                            <FontAwesomeIcon icon={["far", "eye"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Result"}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data_requests_created.map(function(data_request_created, idx){
                            const data_request_link = "/search/" + data_request_created.hash;

                            return (
                                <tr>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_created.success
                                                ? <FontAwesomeIcon icon={["fas", "check"]} size="sm"/>
                                                : <FontAwesomeIcon icon={["fas", "times"]} size="sm"/>
                                        }
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        <a href={data_request_link}>{data_request_created.hash}</a>
                                    </td>
                                    <td class="cell-fit" style={{"width": "20%"}}>
                                        {TimeConverter.convertUnixTimestamp(data_request_created.timestamp, "full")}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request_created.total_fee)}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_created.witnesses}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request_created.collateral)}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_created.consensus_percentage + "%"}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_created.num_errors}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_created.num_liars}
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        {data_request_created.result}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
                <Paginator
                    key={"paginator-" + total_data_requests_created}
                    items={total_data_requests_created}
                    itemsPerPage={data_requests_created.length}
                    pageStart={this.state.current_page}
                    onChangePage={this.onChangePage}
                />
            </Container >
        );
    }

    render() {
        const { details, info, error_value } = this.state;

        if (error_value === "") {
            return (
                <Container fluid style={{"padding": "0px"}}>
                    <Row>
                        <Col xs={8} className="col mb-2">
                            <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                                <Card.Body className="p-1">
                                    <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", "height": "80px" }}>
                                        {
                                            details === null
                                                ? <Spinner animation="border" />
                                                : this.generateDetailsCard(details)
                                        }
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={4} className="col mb-2">
                            <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                                <Card.Body className="p-1">
                                    <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", "height": "80px" }}>
                                        {
                                            info === null
                                                ? <Spinner animation="border" />
                                                : this.generateInfoCard(info)
                                        }
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                                <Card.Body className="p-1">
                                    <Tabs defaultActiveKey="value-transfers" id="uncontrolled-tab-example" onSelect={this.handleTabSelect} style={{"paddingLeft": "1rem", "paddingBottom": "1rem"}}>
                                        <Tab eventKey="value-transfers" title="Transactions">
                                            <Container fluid style={{height: "50vh"}}>
                                                {
                                                    this.state.value_transfers === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateValueTransferCard()
                                                }
                                            </Container>
                                        </Tab>
                                        <Tab eventKey="blocks" title="Blocks">
                                            <Container fluid style={{ height: "50vh" }}>
                                                {
                                                    this.state.blocks === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateBlocksCard()
                                                }
                                            </Container>
                                        </Tab>
                                        <Tab eventKey="mints" title="Mints">
                                            <Container fluid style={{ height: "50vh" }}>
                                                {
                                                    this.state.mints === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateMintsCard()
                                                }
                                            </Container>
                                        </Tab>
                                        <Tab eventKey="data-requests-solved" title="Data requests solved">
                                            <Container fluid style={{ height: "50vh" }}>
                                                {
                                                    this.state.data_requests_solved === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateDataRequestsSolvedCard()
                                                }
                                            </Container>
                                        </Tab>
                                        <Tab eventKey="data-requests-created" title="Data requests created">
                                            <Container fluid style={{ height: "50vh" }}>
                                                {
                                                    this.state.data_requests_created === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateDataRequestsCreatedCard()
                                                }
                                            </Container>
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            );
        }
        else {
            return (
                <Container fluid style={{"padding": "0px"}}>
                    <ErrorCard errorValue={error_value}/>;
                </Container>
            );
        }
    }
}
