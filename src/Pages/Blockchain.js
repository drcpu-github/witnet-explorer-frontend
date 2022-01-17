import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Spinner, Table } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class Reputation extends Component{
    constructor(props) {
        super(props);

        this.onScrollStop = this.onScrollStop.bind(this);
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
            DataService.getBlockchain("update", this.state.last_confirmed_block + 1)
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

    setScrollbarRef(scrollbar) {
        this.scrollbar = scrollbar;
    }

    onScrollStop() {
        // If we reached the end of the blockchain, do not send requests anymore
        if (this.state.epochs[this.state.epochs.length-1] <= 1) {
            return;
        }

        // Prevent rounding errors and fetch a bit upfront
        // Also make sure we are not launching the same request twice by checking the appending value
        if (this.state.appending === false && this.scrollbar.getValues().top >= 0.99) {
            this.setState({
                appending : true
            });

            DataService.getBlockchain("append", this.state.epochs[this.state.epochs.length-1])
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
            <Table style={{"border-collapse": "separate", "border-spacing": "15px"}}>
                <tbody>
                    {
                        this.state.blocks.map(function(block){
                            var block_link = "/search/" + block[0];
                            var address_link = "/search/" + block[3];

                            return (
                                <tr class="row-card" style={{"line-height": "20px"}}>
                                    <td class="cell-fit-card padding-horizontal no-border">
                                        <FontAwesomeIcon icon={["far", "clock"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        {TimeConverter.convertUnixTimestamp(block[2], "full")}
                                    </td>
                                    <td class="cell-fit-card padding-small no-border" title="Epoch">
                                        <FontAwesomeIcon icon={["fas", "history"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        {block[1]}
                                    </td>
                                    <td class="cell-fit-card padding-small cell-truncate" style={{"width": "25%"}}>
                                        <FontAwesomeIcon icon={["fas", "cubes"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        <Link to={block_link}>{block[0]}</Link>
                                    </td>
                                    <td class="cell-fit-card padding-small cell-truncate" style={{"width": "25%"}}>
                                        <FontAwesomeIcon icon={["fas", "user"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        <Link to={address_link}>{block[3]}</Link>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{"width": "8%", "textAlign": "right"}} title="Fee">
                                        <span style={{"float": "left"}}>
                                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        </span>
                                        <span style={{"float": "right"}}>
                                            {Formatter.formatWitValue(block[9], 0)}
                                        </span>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{"width": "4%", "textAlign": "right"}} title="Value transfer">
                                        <span style={{"float": "left"}}>
                                            <FontAwesomeIcon icon={["fas", "coins"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        </span>
                                        <span style={{"float": "right"}}>
                                            {block[4]}
                                        </span>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{"width": "4%", "textAlign": "right"}} title="Data request">
                                        <span style={{"float": "left"}}>
                                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        </span>
                                        <span style={{"float": "right"}}>
                                            {block[5]}
                                        </span>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{"width": "5%", "textAlign": "right"}} title="Commit">
                                        <span style={{"float": "left"}}>
                                            <FontAwesomeIcon icon={["far", "handshake"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        </span>
                                        <span style={{"float": "right"}}>
                                            {block[6]}
                                        </span>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{"width": "5%", "textAlign": "right"}} title="Reveal">
                                        <span style={{"float": "left"}}>
                                            <FontAwesomeIcon icon={["far", "eye"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        </span>
                                        <span style={{"float": "right"}}>
                                            {block[7]}
                                        </span>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{"width": "4%", "textAlign": "right"}} title="Tally">
                                        <span style={{"float": "left"}}>
                                            <FontAwesomeIcon icon={["fas", "calculator"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                        </span>
                                        <span style={{"float": "right"}}>
                                            {block[8]}
                                        </span>
                                    </td>
                                    <td class="cell-fit-card padding-small" style={{"textAlign": "center"}} title="Confirmed">
                                        {block[10]
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
                <Scrollbars hideTracksWhenNotNeeded style={{height: "85vh"}} ref={this.setScrollbarRef.bind(this)} onScrollStop={this.onScrollStop.bind(this)}>
                    <Container fluid>
                        {this.loading_spinner}
                        {this.blockchain}
                        {this.appending_spinner}
                    </Container>
                </Scrollbars>
            </Container>
        );
    }
}
