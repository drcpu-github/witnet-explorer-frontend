import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Tab, Table, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class BlockPanel extends Component {
    generateDetailsCard(data, miner) {
        var block_link = "/search/" + data.hash;
        var miner_link = "/search/" + miner;
        return (
            <Container fluid style={{"paddingLeft": "0px", "paddingRight": "0px", "height": "80px"}}>
                <Table>
                    <tbody>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "cubes"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Block"}
                            </td>
                            <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "70%" }}>
                                <Link to={block_link}>{data.hash}</Link>
                            </td>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Data request weight"}
                            </td>
                            <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "30%" }}>
                                {data.data_request_weight}
                            </td>
                        </tr>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["far", "clock"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Time"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "70%"}}>
                                {TimeConverter.convertUnixTimestamp(data.timestamp, "full") + " (epoch: " + data.epoch + ")"}
                            </td>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "coins"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Value transfer weight"}
                            </td>
                            <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "30%" }}>
                                {data.value_transfer_weight}
                            </td>
                        </tr>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "user"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Miner"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "70%"}}>
                                <Link to={miner_link}>{miner}</Link>
                            </td>
                            <td class="cell-fit-padding-wide" style={{ "borderTop": "none" }}>
                                <FontAwesomeIcon icon={["fas", "feather"]} style={{ "marginRight": "0.25rem" }} size="sm" fixedWidth />{"Block weight"}
                            </td>
                            <td class="cell-fit-no-padding" style={{ "borderTop": "none", "width": "30%" }}>
                                {data.weight}
                            </td>
                        </tr>
                        <tr>
                            <td class="cell-fit-padding-wide" style={{"borderTop": "none"}}>
                                <FontAwesomeIcon icon={["fas", "check"]} style={{"marginRight": "0.25rem"}} size="sm" fixedWidth/>{"Status"}
                            </td>
                            <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "70%"}}>
                                {
                                    data.confirmed
                                        ? "Confirmed"
                                        : "Mined"
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateMintCard(mint) {
        var mint_link = "/search/" + mint.txn_hash;
        return (
            <Container fluid style={{"paddingLeft": "0px", "paddingRight": "0px"}}>
                <Table>
                    <thead>
                        <tr>
                            <th class="cell-fit-padding-wide cell-truncate">
                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Transaction"}
                            </th>
                            <th class="cell-fit-padding-wide cell-truncate">
                                <FontAwesomeIcon icon={["fas", "user"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Address"}
                            </th>
                            <th class="cell-fit-no-padding" style={{ "textAlign": "right" }}>
                                <FontAwesomeIcon icon={["fas", "coins"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Output"}
                            </th>
                            <th class="cell-fit-no-padding" style={{ "borderTop": "none", "borderBottom": "none" }}>
                                {""}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            mint.output_values.map(function(output_value, idx){
                                var address_link = "/search/" + mint.output_addresses[idx];
                                return (
                                    <tr>
                                        <td class="cell-fit-padding-wide">
                                            {
                                                idx === 0
                                                    ? <Link to={mint_link}>{mint.hash}</Link>
                                                    : ""
                                            }
                                        </td>
                                        <td class="cell-fit-padding-wide">
                                            <Link to={address_link}>{mint.output_addresses[idx]}</Link>
                                        </td>
                                        <td class="cell-fit-no-padding" style={{ "textAlign": "right" }}>
                                            {Formatter.formatWitValue(output_value)}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{ "width": "100%", "borderTop": "none" }}>
                                            {""}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateValueTransferCard(value_transfers) {
        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th class="cell-fit-padding-wide">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Transaction"}
                        </th>
                        <th class="cell-fit-padding-wide">
                            <FontAwesomeIcon icon={["fas", "user"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Source"}
                        </th>
                        <th class="cell-fit-padding-wide">
                            <FontAwesomeIcon icon={["fas", "user"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Destination"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                            <FontAwesomeIcon icon={["fas", "coins"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Value"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Fee"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                            <FontAwesomeIcon icon={["fas", "tachometer-alt"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Priority"}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        value_transfers.map(function(value_transfer){
                            const transaction_link = "/search/" + value_transfer.hash;
                            const source_link = (
                                value_transfer.unique_input_addresses.length === 1
                                    ? "/search/" + value_transfer.unique_input_addresses[0]
                                    : ""
                            );
                            const destination_link = (
                                value_transfer.true_output_addresses.length === 1
                                    ? "/search/" + value_transfer.true_output_addresses[0]
                                    : ""
                            );

                            return (
                                <tr>
                                    <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                        <Link to={transaction_link}>{value_transfer.hash}</Link>
                                    </td>
                                    <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                        {
                                            value_transfer.unique_input_addresses.length === 1
                                                ? <Link to={source_link}>{value_transfer.unique_input_addresses[0]}</Link>
                                                : "(multiple inputs)"
                                        }
                                    </td>
                                    <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                        {
                                            value_transfer.true_output_addresses.length === 1
                                                ? <Link to={destination_link}>{value_transfer.true_output_addresses[0]}</Link>
                                                : "(multiple outputs)"
                                        }
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                                        {Formatter.formatWitValue(value_transfer.true_value, 2)}
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                                        {Formatter.formatWitValue(value_transfer.fee, 2)}
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                                        {Formatter.formatValue(value_transfer.priority, 0)}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateDataRequestCard(data_requests) {
        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th class="cell-fit-padding-wide">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Transaction"}
                        </th>
                        <th class="cell-fit-padding-wide">
                            <FontAwesomeIcon icon={["fas", "user"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Requester"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                            <FontAwesomeIcon icon={["far", "handshake"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Collateral"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                            <FontAwesomeIcon icon={["fas", "percentage"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Consensus"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                            <FontAwesomeIcon icon={["fas", "search"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Witnesses"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{ "textAlign": "right" }}>
                            <FontAwesomeIcon icon={["fas", "trophy"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Reward"}
                        </th>
                        <th class="cell-fit-no-padding" style={{ "textAlign": "right" }}>
                            <FontAwesomeIcon icon={["far", "money-bill-alt"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Total fee"}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data_requests.map(function(data_request){
                            const transaction_link = "/search/" + data_request.hash;
                            const requester_link = (
                                data_request.input_addresses.length === 1
                                    ? "/search/" + data_request.input_addresses[0]
                                    : ""
                            );

                            return (
                                <tr>
                                    <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "40%" }}>
                                        <Link to={transaction_link}>{data_request.hash}</Link>
                                    </td>
                                    <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                        {
                                            data_request.input_addresses.length === 1
                                                ? <Link to={requester_link}>{data_request.input_addresses[0]}</Link>
                                                : "(multiple requesters)"
                                        }
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request.collateral, 2)}
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                                        {data_request.consensus_percentage + "%"}
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{"textAlign": "right"}}>
                                        {data_request.witnesses}
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request.witness_reward, 2)}
                                    </td>
                                    <td class="cell-fit-no-padding" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request.miner_fee, 2)}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateCommitCard(commits) {
        return (
            <Table responsive>
                <tbody>
                    {
                        Object.keys(commits).map(function(data_request){
                            var data_request_link = <Link to={"/search/" + data_request}>{data_request}</Link>;
                            var collateral = commits[data_request][0]["collateral"];

                            return ([
                                <tr>
                                    <td class="no-border no-padding" colspan="3">
                                        {"Commits for data request "}
                                        {data_request_link}
                                        {" requiring "}
                                        {Formatter.formatWitValue(collateral, 2)}
                                        {" collateral"}
                                    </td>
                                </tr>,
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th class="cell-fit padding-horizontal-wide">
                                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Transaction"}
                                            </th>
                                            <th class="cell-fit-padding-wide">
                                                <FontAwesomeIcon icon={["fas", "user"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Committer"}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            commits[data_request].map(function(commit) {
                                                const commit_transaction_link = "/search/" + commit.hash;
                                                const committer_link = "/search/" + commit.address;

                                                return (
                                                    <tr>
                                                        <td class="cell-fit padding-horizontal-wide cell-truncate" style={{"width": "45%"}}>
                                                            <Link to={commit_transaction_link}>{commit.hash}</Link>
                                                        </td>
                                                        <td class="cell-fit-padding-wide cell-truncate" style={{"width": "45%"}}>
                                                            <Link to={committer_link}>{commit.address}</Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </Table>
                            ]);
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateRevealCard(reveals) {
        return (
            <Table responsive>
                <tbody>
                    {
                        Object.keys(reveals).map(function(data_request){
                            var data_request_link = <Link to={"/search/" + data_request}>{data_request}</Link>;

                            return ([
                                <tr>
                                    <td class="no-border no-padding" colspan="5">
                                        {"Reveals for data request "}
                                        {data_request_link}
                                    </td>
                                </tr>,
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th class="cell-fit padding-horizontal-wide" style={{ "textAlign": "center" }}>
                                                <FontAwesomeIcon icon={["fas", "check"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Success"}
                                            </th>
                                            <th class="cell-fit-padding-wide">
                                                <FontAwesomeIcon icon={["fas", "align-justify"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Transaction"}
                                            </th>
                                            <th class="cell-fit-padding-wide">
                                                <FontAwesomeIcon icon={["fas", "user"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Revealer"}
                                            </th>
                                            <th class="cell-fit-no-padding">
                                                <FontAwesomeIcon icon={["fas", "trophy"]} style={{ "marginRight": "0.25rem" }} size="sm" />{"Result"}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            reveals[data_request].map(function(reveal) {
                                                const reveal_transaction_link = "/search/" + reveal.hash;
                                                const revealer_link = "/search/" + reveal.address;

                                                return (
                                                    <tr>
                                                        <td class="cell-fit padding-horizontal-wide" style={{ "textAlign": "center" }}>
                                                            {
                                                                reveal.success
                                                                    ? <FontAwesomeIcon icon={["fas", "check"]} size="sm" />
                                                                    : <FontAwesomeIcon icon={["fas", "times"]} size="sm" />
                                                            }
                                                        </td>
                                                        <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                                            <Link to={reveal_transaction_link}>{reveal.hash}</Link>
                                                        </td>
                                                        <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                                            <Link to={revealer_link}>{reveal.address}</Link>
                                                        </td>
                                                        <td class="cell-fit-no-padding cell-truncate" style={{ "width": "35%" }}>
                                                            {reveal.reveal}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </Table>
                            ]);
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateTallyCard(tallies) {
        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["far", "check"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Success"}
                        </th>
                        <th class="cell-fit-padding-wide">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Transaction"}
                        </th>
                        <th class="cell-fit-padding-wide">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Data request"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "times"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Errors"}
                        </th>
                        <th class="cell-fit-padding-wide" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "bolt"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Liars"}
                        </th>
                        <th class="cell-fit-no-padding">
                            <FontAwesomeIcon icon={["far", "eye"]} style={{"marginRight": "0.25rem"}} size="sm"/>{"Result"}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tallies.map(function(tally){
                            const tally_transaction_link = "/search/" + tally.hash;
                            const data_request_transaction_link = "/search/" + tally.data_request;

                            return (
                                <tr>
                                    <td class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                        {
                                            tally.success === true
                                                ? <FontAwesomeIcon icon={["fas", "check"]} size="sm" />
                                                : <FontAwesomeIcon icon={["fas", "times"]} size="sm" />
                                        }
                                    </td>
                                    <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                        <Link to={tally_transaction_link}>{tally.hash}</Link>
                                    </td>
                                    <td class="cell-fit-padding-wide cell-truncate" style={{ "width": "30%" }}>
                                        <Link to={data_request_transaction_link}>{tally.data_request}</Link>
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                        {tally.num_error_addresses}
                                    </td>
                                    <td class="cell-fit-padding-wide" style={{ "textAlign": "center" }}>
                                        {tally.num_liar_addresses}
                                    </td>
                                    <td class="cell-fit-no-padding cell-truncate" style={{ "width": "30%" }}>
                                        {tally.tally}
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
        const data = this.props.data;

        var value_transfer_tab_title = data.transactions.value_transfer.length === 1
            ? "1 value transfer"
            : data.transactions.value_transfer.length + " value transfers";
        var data_request_tab_title = data.transactions.data_request.length === 1
            ? "1 data request"
            : data.transactions.data_request.length + " data requests";
        var commit_tab_title = data.transactions.number_of_commits === 1
            ? "1 commit"
            : data.transactions.number_of_commits + " commits";
        var reveal_tab_title = data.transactions.number_of_reveals === 1
            ? "1 reveal"
            : data.transactions.number_of_reveals + " reveals";
        var tally_tab_title = data.transactions.tally.length === 1
            ? "1 tally"
            : data.transactions.tally.length + " tallies";

        return (
            <Container fluid style={{"padding": "0px"}}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-1">
                        <Card.Text>
                            {this.generateDetailsCard(data.details, data.transactions.mint.miner)}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-1">
                        <Card.Text>
                            <Tabs defaultActiveKey="mint" id="uncontrolled-tab-example" style={{"paddingLeft": "1rem", "paddingBottom": "1rem"}}>
                                <Tab eventKey="mint" title="Mint">
                                    <Container fluid style={{ "display": "block", "height": "55vh", "overflow-y": "scroll" }}>
                                        {this.generateMintCard(data.transactions.mint)}
                                    </Container>
                                </Tab>
                                <Tab eventKey="value_transfer" title={value_transfer_tab_title}>
                                    <Container fluid style={{ "display": "block", "height": "55vh", "overflow-y": "scroll" }}>
                                        {this.generateValueTransferCard(data.transactions.value_transfer)}
                                    </Container>
                                </Tab>
                                <Tab eventKey="data_request" title={data_request_tab_title}>
                                    <Container fluid style={{ "display": "block", "height": "55vh", "overflow-y": "scroll" }}>
                                        {this.generateDataRequestCard(data.transactions.data_request)}
                                    </Container>
                                </Tab>
                                <Tab eventKey="commit" title={commit_tab_title}>
                                    <Container fluid style={{ "display": "block", "height": "55vh", "overflow-y": "scroll" }}>
                                        {this.generateCommitCard(data.transactions.commit)}
                                    </Container>
                                </Tab>
                                <Tab eventKey="reveal" title={reveal_tab_title}>
                                    <Container fluid style={{ "display": "block", "height": "55vh", "overflow-y": "scroll" }}>
                                        {this.generateRevealCard(data.transactions.reveal)}
                                    </Container>
                                </Tab>
                                <Tab eventKey="tally" title={tally_tab_title}>
                                    <Container fluid style={{ "display": "block", "height": "55vh", "overflow-y": "scroll" }}>
                                        {this.generateTallyCard(data.transactions.tally)}
                                    </Container>
                                </Tab>
                            </Tabs>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
