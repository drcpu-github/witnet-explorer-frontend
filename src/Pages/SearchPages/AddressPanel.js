import React, { Component } from "react";
import { Card, Container, Spinner, Tab, Table, Tabs } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorCard from "../../Components/ErrorCard";

import DataService from "../../Services/DataService";
import Formatter from "../../Services/Formatter";
import TimeConverter from "../../Services/TimeConverter";

export default class AddressPanel extends Component {
    constructor(props) {
        super(props);

        this.loadData = this.loadData.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            address: props.address,
            address_details: null,
            address_value_transfers: null,
            address_blocks: null,
            address_data_requests_solved: null,
            address_data_requests_launched: null,
            error_value: "",
        };

        if (this.state.address !== "") {
            this.loadData(this.state.address, "details");
            this.loadData(this.state.address, "value_transfers");
        }
    }

    handleSelect(tab) {
        if (tab === "value_transfers" && this.state.address_value_transfers === null) {
            this.loadData(this.state.address, "value_transfers");
        }
        else if (tab === "blocks" && this.state.address_blocks === null) {
            this.loadData(this.state.address, "blocks");
        }
        else if (tab === "data_requests_solved" && this.state.address_data_requests_solved === null) {
            this.loadData(this.state.address, "data_requests_solved");
        }
        else if (tab === "data_requests_launched" && this.state.address_data_requests_launched === null) {
            this.loadData(this.state.address, "data_requests_launched");
        }
    }

    loadData(address, tab) {
        DataService.searchAddress(address, tab)
        .then(response => {
            if (tab === "details") {
                this.setState({
                    address_details: response,
                });
            }
            else if (tab === "value_transfers") {
                this.setState({
                    address_value_transfers: response.value_transfers,
                });
            }
            else if (tab === "blocks") {
                this.setState({
                    address_blocks: response.blocks,
                });
            }
            else if (tab === "data_requests_solved") {
                this.setState({
                    address_data_requests_solved: response.data_requests_solved,
                });
            }
            else if (tab === "data_requests_launched") {
                this.setState({
                    address_data_requests_launched: response.data_requests_launched,
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

    generateDetailsCard(data) {
        var address_link = "/search/" + data.address;
        return (
            <Container fluid>
                <Table>
                    <tbody>
                        <tr style={{"line-height": "20px"}}>
                            <td style={{"padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap"}}>
                                <FontAwesomeIcon icon={["fas", "user"]} size="sm" fixedWidth style={{"marginRight": "0.25rem"}}/>{"Account"}
                            </td>
                            <td style={{"padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap"}}>
                                <a href={address_link}>{data.address}</a>
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td style={{"padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap"}}>
                                <FontAwesomeIcon icon={["fas", "wallet"]} size="sm" fixedWidth style={{"marginRight": "0.25rem"}}/>{"Balance"}
                            </td>
                            <td style={{"padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap"}}>
                                {
                                    data.balance === "Could not retrieve balance"
                                        ? data.balance
                                        : Formatter.formatWitValue(data.balance)
                                }
                            </td>
                        </tr>
                        <tr style={{"line-height": "20px"}}>
                            <td style={{"padding": "0px", "paddingRight": "2rem", "border": "none", "whiteSpace": "nowrap"}}>
                                <FontAwesomeIcon icon={["fas", "star"]} size="sm" fixedWidth style={{"marginRight": "0.25rem"}}/>{"Reputation"}
                            </td>
                            <td style={{"padding": "0px", "border": "none", "width": "100%", "whiteSpace": "nowrap"}}>
                                {data.reputation}
                                {
                                    data.eligibility === "Could not retrieve eligibility"
                                        ? " (" + data.eligibility + ")"
                                        : " (" + (data.eligibility / data.total_reputation * 100).toFixed(2) + "%)"
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }

    generateValueTransferCard(value_transfers) {
        return (
            <Table hover responsive>
                <thead>
                    <tr style={{"line-height": "20px"}}>
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
                        value_transfers.map(function(value_transfer, idx){
                            const txn_link = "/search/" + value_transfer[1];
                            const source_link = "/search/" + value_transfer[4];
                            const destination_link = "/search/" + value_transfer[5];

                            let icon;
                            if (value_transfer[9] ===  true) { // reverted
                                icon = <FontAwesomeIcon icon={["fas", "exclamation"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                            }
                            else {
                                if (value_transfer[0] === 0) { // Merge or split transaction to the same address
                                    icon = <FontAwesomeIcon icon={["fas", "equals"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                }
                                else if (value_transfer[0] === 1) { // Incoming transaction
                                    icon = <FontAwesomeIcon icon={["fas", "plus"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                }
                                else if  (value_transfer[0] === 2) {  // Outgoing transaction
                                    icon = <FontAwesomeIcon icon={["fas", "minus"]} size="sm" style={{"marginRight": "0.25rem"}}/>
                                }
                            }

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        {icon}<a href={txn_link}>{value_transfer[1]}</a>
                                    </td>
                                    <td class="cell-fit">
                                        {TimeConverter.convertUnixTimestamp(value_transfer[3], "full")}
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        {
                                            value_transfer[4].includes("multiple") || value_transfer[4].includes("genesis")
                                                ? value_transfer[4]
                                                : <a href={source_link}>{value_transfer[4]}</a>
                                        }
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        {
                                            value_transfer[5].includes("multiple") || value_transfer[5].includes("genesis")
                                                ? value_transfer[5]
                                                : <a href={destination_link}>{value_transfer[5]}</a>
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(value_transfer[6], 2)}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(value_transfer[7], 2)}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatValue(value_transfer[8], 0)}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            value_transfer[9]
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

    generateBlocksCard(blocks) {
        return (
            <Table hover responsive>
                <thead>
                    <tr style={{"line-height": "20px"}}>
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
                        blocks.map(function(block, idx){
                            const block_link = "/search/" + block[0];

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        <a href={block_link}>{block[0]}</a>
                                    </td>
                                    <td class="cell-fit">
                                        {TimeConverter.convertUnixTimestamp(block[1], "full")}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {block[2]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(block[3])}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(block[4])}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {block[5]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {block[6]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {block[7]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {block[8]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {block[9]}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );
    }

    generateDataRequestsSolvedCard(data_requests_solved) {
        return (
            <Table hover responsive>
                <thead>
                    <tr style={{"line-height": "20px"}}>
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "check"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Success"}
                        </th>
                        <th class="cell-fit">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Data request"}
                        </th>
                        <th class="cell-fit">
                            <FontAwesomeIcon icon={["far", "clock"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Timestamp"}
                        </th>
                        <th class="cell-fit" style={{"textAlign": "right"}}>
                            <FontAwesomeIcon icon={["far", "handshake"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Collateral"}
                        </th>
                        <th class="cell-fit">
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
                            const data_request_link = "/search/" + data_request_solved[1];

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_solved[0]
                                                ? <FontAwesomeIcon icon={["fas", "check"]} size="sm"/>
                                                : <FontAwesomeIcon icon={["fas", "times"]} size="sm"/>
                                        }
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "30%"}}>
                                        <a href={data_request_link}>{data_request_solved[1]}</a>
                                    </td>
                                    <td class="cell-fit">
                                        {TimeConverter.convertUnixTimestamp(data_request_solved[3], "full")}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request_solved[4])}
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "30%"}}>
                                        {data_request_solved[6]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_solved[7]
                                                ? <FontAwesomeIcon icon={["fas", "times"]} size="sm"/>
                                                : ""
                                        }
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_solved[8]
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
        );
    }

    generateDataRequestsLaunchedCard(data_requests_launched) {
        return (
            <Table hover responsive>
                <thead>
                    <tr style={{"line-height": "20px"}}>
                        <th class="cell-fit" style={{"textAlign": "center"}}>
                            <FontAwesomeIcon icon={["fas", "check"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Success"}
                        </th>
                        <th class="cell-fit">
                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Data request"}
                        </th>
                        <th class="cell-fit">
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
                        <th class="cell-fit">
                            <FontAwesomeIcon icon={["far", "eye"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Result"}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data_requests_launched.map(function(data_request_launched, idx){
                            const data_request_link = "/search/" + data_request_launched[1];

                            return (
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {
                                            data_request_launched[0]
                                                ? <FontAwesomeIcon icon={["fas", "check"]} size="sm"/>
                                                : <FontAwesomeIcon icon={["fas", "times"]} size="sm"/>
                                        }
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        <a href={data_request_link}>{data_request_launched[1]}</a>
                                    </td>
                                    <td class="cell-fit" style={{"width": "20%"}}>
                                        {TimeConverter.convertUnixTimestamp(data_request_launched[3], "full")}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request_launched[4])}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_launched[5]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "right"}}>
                                        {Formatter.formatWitValue(data_request_launched[6])}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_launched[7] + "%"}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_launched[8]}
                                    </td>
                                    <td class="cell-fit" style={{"textAlign": "center"}}>
                                        {data_request_launched[9]}
                                    </td>
                                    <td class="cell-fit cell-truncate" style={{"width": "20%"}}>
                                        {data_request_launched[10]}
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
        const { address_details, address_value_transfers, address_blocks, address_data_requests_solved, address_data_requests_launched, error_value } = this.state;

        if (error_value === "") {
            return (
                <Container fluid style={{"padding": "0px"}}>
                    <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                        <Card.Body className="p-1">
                            <Card.Text>
                                <Container fluid style={{paddingLeft: "0px", paddingRight: "0px", "height": "60px"}}>
                                    {
                                        address_details === null
                                            ? <Spinner animation="border" />
                                            : this.generateDetailsCard(address_details)
                                    }
                                </Container>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                        <Card.Body className="p-1">
                            <Card.Text>
                                <Tabs defaultActiveKey="value_transfers" id="uncontrolled-tab-example" onSelect={this.handleSelect} style={{"paddingLeft": "1rem", "paddingBottom": "1rem"}}>
                                    <Tab eventKey="value_transfers" title="Transactions">
                                        <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMin={"55vh"} autoHeightMax={"55vh"}>
                                            <Container fluid>
                                                {
                                                    address_value_transfers === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateValueTransferCard(address_value_transfers)
                                                }
                                            </Container>
                                        </Scrollbars>
                                    </Tab>
                                    <Tab eventKey="blocks" title="Blocks">
                                        <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMin={"55vh"} autoHeightMax={"55vh"}>
                                            <Container fluid>
                                                {
                                                    address_blocks === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateBlocksCard(address_blocks)
                                                }
                                            </Container>
                                        </Scrollbars>
                                    </Tab>
                                    <Tab eventKey="data_requests_solved" title="Data requests solved">
                                        <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMin={"55vh"} autoHeightMax={"55vh"}>
                                            <Container fluid>
                                                {
                                                    address_data_requests_solved === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateDataRequestsSolvedCard(address_data_requests_solved)
                                                }
                                            </Container>
                                        </Scrollbars>
                                    </Tab>
                                    <Tab eventKey="data_requests_launched" title="Data requests launched">
                                        <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMin={"55vh"} autoHeightMax={"55vh"}>
                                            <Container fluid>
                                                {
                                                    address_data_requests_launched === null
                                                        ? <Spinner animation="border" />
                                                        : this.generateDataRequestsLaunchedCard(address_data_requests_launched)
                                                }
                                            </Container>
                                        </Scrollbars>
                                    </Tab>
                                </Tabs>
                            </Card.Text>
                        </Card.Body>
                    </Card>
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
