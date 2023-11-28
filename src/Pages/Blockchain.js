import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorCard from "../Components/ErrorCard";
import Paginator from "../Components/Paginator";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class Reputation extends Component{
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error_value: "",
            current_page: 1,
            epochs: [],
            blockchain_card: null,
        }

        this.getBlockchain = this.getBlockchain.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount() {
        this.getBlockchain(1);
    }

    componentWillUnmount() {
        this.setState({
            loading: false,
            error_value: "",
            current_page: 1,
            epochs: [],
            blockchain_card: null,
        });
    }

    getBlockchain(page) {
        DataService.getBlockchain(page)
        .then(response => {
            const pagination_header = JSON.parse(response[0].get("X-Pagination"));
            const json_response = response[1];
            var new_blockchain_card = this.generateBlockchainCard(json_response.blockchain, pagination_header.total);
            this.setState({
                blockchain_card: new_blockchain_card,
                loading: false,
                error_value: "",
            });
        })
        .catch(e => {
            console.log(e);
            this.setState({
                loading: false,
                error_value: "Could not fetch blockchain!"
            });
        });
    }

    generateBlockchainCard(blocks, total_blocks) {
        const { current_page } = this.state;

        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{ height: "85vh" }}>
                <Table
                    style={{
                        "border-collapse": "separate",
                        "display": "block",
                        "height": "80vh",
                        "overflow-y":
                        "scroll",
                        "margin-bottom": "0rem",
                        "border-spacing": "5px 15px"
                    }}
                >
                    <tbody>
                        {
                            blocks.map(function (block) {
                                var block_link = "/search/" + block.hash;
                                var miner_link = "/search/" + block.miner;

                                return (
                                    <tr class="row-card">
                                        <td class="cell-fit-card" title="Timestamp" style={{ "paddingLeft": "1rem", "paddingRight": "0rem" }}>
                                            <FontAwesomeIcon icon={["far", "clock"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" title="Timestamp">
                                            {TimeConverter.convertUnixTimestamp(block.timestamp, "full")}
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Epoch">
                                            <FontAwesomeIcon icon={["fas", "history"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" title="Epoch">
                                            {block.epoch}
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Block hash">
                                            <FontAwesomeIcon icon={["fas", "cubes"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card cell-truncate padding-small" style={{ "width": "30%" }} title="Block hash">
                                            <Link to={block_link}>{block.hash}</Link>
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Miner">
                                            <FontAwesomeIcon icon={["fas", "user"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card cell-truncate padding-small" style={{ "width": "30%" }} title="Miner">
                                            <Link to={miner_link}>{block.miner}</Link>
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Fee">
                                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Fee">
                                            {Formatter.formatWitValue(block.fees, 0)}
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Value transfer">
                                            <FontAwesomeIcon icon={["fas", "coins"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Value transfer">
                                            {block.value_transfers}
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Data request">
                                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Data request">
                                            {block.data_requests}
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Commit">
                                            <FontAwesomeIcon icon={["far", "handshake"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Commit">
                                            {block.commits}
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Reveal">
                                            <FontAwesomeIcon icon={["far", "eye"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Reveal">
                                            {block.reveals}
                                        </td>
                                        <td class="cell-fit-card no-padding" title="Tally">
                                            <FontAwesomeIcon icon={["fas", "calculator"]} size="sm" />
                                        </td>
                                        <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Tally">
                                            {block.tallies}
                                        </td>
                                        <td class="cell-fit-card padding-small" style={{ "textAlign": "center" }} title={block.confirmed ? "Confirmed" : "Unconfirmed"}>
                                            {
                                                block.confirmed
                                                    ? <FontAwesomeIcon icon={["fas", "lock"]} size="sm" />
                                                    : <FontAwesomeIcon icon={["fas", "unlock"]} size="sm" />
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <Card.Text style={{ "padding-top": "0.5rem", "position": "relative" }}>
                    <Paginator
                        key={"paginator-" + total_blocks}
                        items={total_blocks}
                        itemsPerPage={blocks.length}
                        pageStart={current_page}
                        onChangePage={this.onChangePage}
                    />
                </Card.Text>
            </Card>
        );
    }

    onChangePage(paginator) {
        this.setState({
            current_page: paginator.current_page,
        });
        this.getBlockchain(paginator.current_page);
    }

    render() {
        const { blockchain_card, error_value, loading } = this.state;

        return(
            <Container fluid>
                {
                    loading
                        ? <SpinnerCard height="85vh" />
                        : error_value === ""
                            ? blockchain_card
                            : <ErrorCard errorValue={error_value}/>
                }
            </Container>
        );
    }
}
