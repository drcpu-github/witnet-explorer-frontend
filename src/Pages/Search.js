import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Container, Table } from "react-bootstrap";

import HistoryTypeahead from "../Components/HistoryTypeahead"

import AddressPanel from "./SearchPages/AddressPanel"
import BlockPanel from "./SearchPages/BlockPanel"
import DataRequestReport from "./SearchPages/DataRequestPages/DataRequestReport"
import DataRequestHistoryPanel from "./SearchPages/DataRequestHistoryPanel"
import MintPanel from "./SearchPages/MintPanel"
import RadHistoryPanel from "./SearchPages/RadHistoryPanel"
import ValueTransferPanel from "./SearchPages/ValueTransferPanel"

import DataService from "../Services/DataService";

export default class Search extends Component{
    constructor(props) {
        super(props);

        this.resetState = this.resetState.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.searchValue = this.searchValue.bind(this);
        this.handleEnterPressed = this.handleEnterPressed.bind(this);

        this.state = {
            search_value: "",
            search_response: {},
            searching_address: false,
            error_value: "",
            loading: false
        };

        if (props.match.params.hash) {
            this.state.loading = true;
            this.state.search_value = props.match.params.hash;
        }
    }

    componentDidMount(){
        if (this.state.search_value !== "") {
            this.searchValue(this.state.search_value);
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.hash !== this.props.match.params.hash){
            this.searchValue(this.props.match.params.hash);
        }
    }

    resetState() {
        this.setState({
            search_value: "",
            search_response: {},
            searching_address: false,
            error_value: "",
            loading: false
        });
    }

    onChangeSearch(search) {
        console.log("onChangeSearch: " + search)
        this.setState({
            search_value: search.target.value
        });
    }

    handleEnterPressed(target) {
        if (target.charCode === 13) {
            window.open("/search/" + this.state.search_value, "_self");
        }
    }

    searchValue(value) {
        if (value.startsWith("wit1")) {
            this.setState({
                search_value: value,
                searching_address: true,
            });
        }
        else {
            this.setState({
                loading: true
            });

            if (Number.isInteger(Number(value)) && value.length <= 8) {
                DataService.searchEpoch(value)
                    .then(response => {
                        this.setState({
                            loading: false,
                            search_response: response
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        this.setState({
                            loading: false,
                            error_value: "Search value not found"
                        });
                    });
            }
            else {
                DataService.searchHash(value)
                    .then(response => {
                        this.setState({
                            loading: false,
                            search_response: response
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        this.setState({
                            loading: false,
                            error_value: "Search value not found"
                        });
                    });
            }
        }
    }

    generateTransactionPanel(data) {
        var txn_link = "/search/" + data.txn_hash;
        return (
            <Container fluid style={{"padding": "0px"}}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-3">
                        <Card.Text>
                            <Table>
                                <tbody>
                                    <tr style={{"line-height": "20px"}}>
                                        <td class="cell-fit-padding-very-wide" style={{"borderTop": "none"}}>
                                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Transaction"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                            <Link to={txn_link}>{data.txn_hash}</Link>
                                        </td>
                                    </tr>
                                    <tr style={{"line-height": "20px"}}>
                                        <td class="cell-fit-padding-very-wide" style={{"borderTop": "none"}}>
                                            <FontAwesomeIcon icon={["fas", "wallet"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Status"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                            {data.message}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    generateErrorPanel(error) {
        return (
            <Container fluid style={{"padding": "0px"}}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-3">
                        <Card.Text>
                            <Table style={{"margin": "0px"}}>
                                <tbody>
                                    <tr style={{"line-height": "20px"}}>
                                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                            {error}
                                        </td>
                                    </tr>
                                    <tr>
                                        <img src="/sad.png" alt="" width="30%"/>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    render() {
        const { search_value, search_response, searching_address, error_value, loading } = this.state;

        let searchResultPanel;
        if (error_value === "") {
            if (searching_address) {
                searchResultPanel = <AddressPanel address={search_value}/>
            }
            else if (loading) {
                searchResultPanel = <Spinner animation="border" />;
            }
            else {
                // Check if the transaction is still pending or if an unknown hash was supplied
                if (search_response.status === "pending") {
                    searchResultPanel = this.generateTransactionPanel(search_response);
                }
                else if (search_response.status === "error") {
                    searchResultPanel = this.generateErrorPanel(search_response.message);
                }
                // If not, check if it was a block
                else if (search_response.type === "RnV0dXJlIGVwb2No") {
                    searchResultPanel = this.generateErrorPanel(atob(search_response.value));
                }
                // If not, check if it was a block
                else if (search_response.type === "block") {
                    searchResultPanel = <BlockPanel data={search_response}/>;
                }
                // If not, check if it was a transaction related to a data request
                else if (search_response.type === "data_request_report") {
                    searchResultPanel = <DataRequestReport type={search_response.transaction_type} data={search_response}/>
                }
                else if (search_response.type === "data_request_history") {
                    if (search_response.hasOwnProperty("data_request_parameters")) {
                        searchResultPanel = <DataRequestHistoryPanel data={search_response}/>
                    }
                    else {
                        searchResultPanel = <RadHistoryPanel data={search_response}/>
                    }
                }
                // If not, check if it was a mint transaction
                else if (search_response.type === "mint_txn") {
                    searchResultPanel = <MintPanel data={search_response}/>;
                }
                // If not, check if it was a search_value transfer transaction
                else if (search_response.type === "value_transfer_txn") {
                    searchResultPanel = <ValueTransferPanel data={search_response}/>
                }
            }
        }
        else {
            searchResultPanel = this.generateErrorPanel(error_value);
        }

        return (
            <Container fluid style={{ paddingLeft: "50px", paddingRight: "50px", height: "100%" }}>
                <HistoryTypeahead/>
                {searchResultPanel}
            </Container>
        );
    };
}
