import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Spinner, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class Reputation extends Component{
    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.updateBlockchain = this.updateBlockchain.bind(this);

        this.state = {
            loading: true,
            appending: false,
            blocks: [],
            epochs: [],
            last_updated: "",
            last_confirmed_block: 0
        }
    }

    componentDidMount() {
        this.initBlockchain();
        // run every 30 seconds
        this.interval_id = setInterval(this.updateBlockchain, 30000);
    }

    componentWillUnmount() {
        this.setState({
            blocks: [],
            epochs: [],
            last_updated: "",
            last_confirmed_block: 0
        });
        clearInterval(this.interval_id);
    }

    initBlockchain() {
        DataService.getBlockchain("init")
        .then(response => {
            var current_confirmed_block = 0;
            for (var block = 0; block < response.blockchain.length; block++) {
                if (response.blockchain[block][10] === true && response.blockchain[block][1] >= current_confirmed_block) {
                    current_confirmed_block = response.blockchain[block][1];
                }
                this.setState({
                    blocks: [...this.state.blocks, response.blockchain[block]],
                    epochs: [...this.state.epochs, response.blockchain[block][1]],
                });
            }
            this.blockchain = this.generateBlockchainCard();
            this.setState({
                loading: false,
                last_updated: TimeConverter.convertUnixTimestamp(response.last_updated, "full"),
                last_confirmed_block: current_confirmed_block
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    updateBlockchain() {
        if (!this.state.loading) {
            DataService.getBlockchain("append", this.state.last_confirmed_block + 1)
            .then(response => {
                // Remove the reverted blocks
                var reverted = response.reverted;
                for (var i = 0; i < reverted.length; i++) {
                    var idx1 = this.state.epochs.indexOf(reverted[i]);
                    // Update confirmed status
                    if (idx1 !== -1) {
                        // Take a local copy
                        const epochs_copy = this.state.epochs.slice();
                        const blocks_copy = this.state.blocks.slice();
                        // Remove the element
                        epochs_copy.splice(idx1, 1);
                        blocks_copy.splice(idx1, 1);
                        // Set state to local copy
                        this.setState({
                            epochs: epochs_copy,
                            blocks: blocks_copy,
                        });
                    }
                }
                // Append or modify the blockchain
                var current_confirmed_block = this.state.last_confirmed_block;
                var blockchain = response.blockchain;
                for (var j = 0; j < blockchain.length; j++) {
                    var idx2 = this.state.epochs.indexOf(blockchain[j][1]);
                    // Update confirmed status
                    if (idx2 !== -1) {
                        // Only update confirmed blocks
                        if (blockchain[j][10] === true) {
                            // Take a local copy
                            const blocks_copy = this.state.blocks.slice();
                            // Modify the confirmed status
                            blocks_copy[idx2][10] = blockchain[j][10];
                            // Check for the latest confirmed block
                            if (blockchain[j][1] >= current_confirmed_block) {
                                current_confirmed_block = blockchain[j][1];
                            }
                            // Set state to local copy
                            this.setState({
                                blocks: blocks_copy,
                            });
                        }
                    }
                    // Append block
                    else {
                        this.setState({
                            blocks: [blockchain[j], ...this.state.blocks],
                            epochs: [blockchain[j][1], ...this.state.epochs]
                        });
                    }
                }
                this.blockchain = this.generateBlockchainCard();
                this.setState({
                    last_updated: TimeConverter.convertUnixTimestamp(response.last_updated, "full"),
                    last_confirmed_block: current_confirmed_block
                });
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    handleScroll(event) {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        const scroll = scrollHeight - scrollTop - clientHeight;

        // If we reached the end of the blockchain, do not send requests anymore
        if (this.state.epochs[this.state.epochs.length-1] <= 1) {
            return;
        }

        // Prevent rounding errors and fetch a bit upfront
        // Also make sure we are not launching the same request twice by checking the appending value
        if (this.state.appending === false && scroll <= 100) {
            this.setState({
                appending : true
            });

            DataService.getBlockchain("prepend", this.state.epochs[this.state.epochs.length-1])
            .then(response => {
                for (var block = 0; block < response.blockchain.length; block++) {
                    this.setState({
                        blocks: [...this.state.blocks, response.blockchain[block]],
                        epochs: [...this.state.epochs, response.blockchain[block][1]]
                    });
                }
                this.blockchain = this.generateBlockchainCard();
                this.setState({
                    appending : false,
                    last_updated : TimeConverter.convertUnixTimestamp(response.last_updated, "full")
                });
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    generateBlockchainCard() {
        return (
            <Table responsive style={{borderCollapse: "separate", marginBottom: "0rem", borderSpacing: "5px 15px"}}>
                <tbody style={{display: "block", maxHeight: "85vh", overflow: "auto"}} onScroll={this.handleScroll}>
                    {
                        this.state.blocks.map(function(block){
                            var block_link = "/search/" + block[0];
                            var address_link = "/search/" + block[3];

                            return (
                                <tr class="row-card">
                                    <td class="cell-fit-card" title="Timestamp" style={{"paddingLeft": "1rem", "paddingRight": "0rem"}}>
                                        <FontAwesomeIcon icon={["far", "clock"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" title="Timestamp">
                                        {TimeConverter.convertUnixTimestamp(block[2], "full")}
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Epoch">
                                        <FontAwesomeIcon icon={["fas", "history"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" title="Epoch">
                                        {block[1]}
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Block hash">
                                        <FontAwesomeIcon icon={["fas", "cubes"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card cell-truncate padding-small" style={{ "width": "30%" }} title="Block hash">
                                        <Link to={block_link}>{block[0]}</Link>
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Miner">
                                        <FontAwesomeIcon icon={["fas", "user"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card cell-truncate padding-small" style={{ "width": "30%" }} title="Miner">
                                        <Link to={address_link}>{block[3]}</Link>
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Fee">
                                        <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Fee">
                                        {Formatter.formatWitValue(block[9], 0)}
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Value transfer">
                                        <FontAwesomeIcon icon={["fas", "coins"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Value transfer">
                                        {block[4]}
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Data request">
                                        <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Data request">
                                        {block[5]}
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Commit">
                                        <FontAwesomeIcon icon={["far", "handshake"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Commit">
                                        {block[6]}
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Reveal">
                                        <FontAwesomeIcon icon={["far", "eye"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Reveal">
                                        {block[7]}
                                    </td>
                                    <td class="cell-fit-card no-padding" title="Tally">
                                        <FontAwesomeIcon icon={["fas", "calculator"]} size="sm"/>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{ "textAlign": "right" }} title="Tally">
                                        {block[8]}
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{ "textAlign": "center" }} title={block[10] ? "Confirmed" : "Unconfirmed"}>
                                        {
                                            block[10]
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
        const { appending, loading } = this.state;

        if (loading) {
            this.loading_spinner = <Spinner animation="border"/>;
        }
        else {
            this.loading_spinner = <div></div>;
        }

        if (appending) {
            this.appending_spinner = <Spinner animation="border"/>;
        }
        else {
            this.appending_spinner = <div></div>;
        }

        return(
            <Container fluid>
                {this.loading_spinner}
                {this.blockchain}
                {this.appending_spinner}
            </Container>
        );
    }
}
