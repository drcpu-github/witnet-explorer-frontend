import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Container, Table } from "react-bootstrap";

import HistoryTypeahead from "../Components/HistoryTypeahead"

import AddressPanel from "./SearchPages/AddressPanel"
import BlockPanel from "./SearchPages/BlockPanel"
import DataRequestReport from "./SearchPages/DataRequestPages/DataRequestReport"
import DataRequest from "./SearchPages/DataRequestPages/DataRequest"
import Commit from "./SearchPages/DataRequestPages/Commit"
import Reveal from "./SearchPages/DataRequestPages/Reveal"
import Tally from "./SearchPages/DataRequestPages/Tally"
import DataRequestHistoryPanel from "./SearchPages/DataRequestHistoryPanel"
import MintPanel from "./SearchPages/MintPanel"
import RadHistoryPanel from "./SearchPages/RadHistoryPanel"
import ValueTransferPanel from "./SearchPages/ValueTransferPanel"

import DataService from "../Services/DataService";

export default class Search extends Component{
    constructor(props) {
        super(props);

        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.searchValue = this.searchValue.bind(this);
        this.handleEnterPressed = this.handleEnterPressed.bind(this);

        this.state = {
            search_value: "",
            search_header: null,
            search_response: null,
            searching_address: false,
            error_value: "",
            loading: false,
            loading_next_page: false,
            current_page: 1,
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

    onChangeSearch(search) {
        this.setState({
            search_value: search.target.value
        });
    }

    handleEnterPressed(target) {
        if (target.charCode === 13) {
            window.open("/search/" + this.state.search_value, "_self");
        }
    }

    searchValue(value, page=1, loading="") {
        var simple = new URLSearchParams(window.location.search).get("simple") || false;

        if (value.startsWith("wit1")) {
            this.setState({
                search_value: value,
                searching_address: true,
            });
        }
        else {
            if (loading === "history") {
                this.setState({
                    loading_next_page: true
                });
            }
            else {
                this.setState({
                    loading: true
                });
            }

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
                DataService.searchHash(value, page, simple)
                    .then(response => {
                        if ("code" in response && response.code === 404) {
                            this.setState({
                                loading: false,
                                loading_next_page: false,
                                error_value: response.message,
                            });
                        }
                        else {
                            this.setState({
                                loading: false,
                                loading_next_page: false,
                                search_header: JSON.parse(response[0].get("X-Pagination")),
                                search_response: response[1],
                            });
                        }
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
        var txn_link = "/search/" + this.state.search_value;
        return (
            <Container fluid style={{"padding": "0px"}}>
                <Card className="w-100 shadow p-1 mb-3 bg-white rounded">
                    <Card.Body className="p-1">
                        <Card.Text>
                            <Table>
                                <tbody>
                                    <tr style={{"line-height": "20px"}}>
                                        <td class="cell-fit-padding-very-wide" style={{"borderTop": "none"}}>
                                            <FontAwesomeIcon icon={["fas", "align-justify"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Transaction"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                            <Link to={txn_link}>{this.state.search_value}</Link>
                                        </td>
                                    </tr>
                                    <tr style={{"line-height": "20px"}}>
                                        <td class="cell-fit-padding-very-wide" style={{"borderTop": "none"}}>
                                            <FontAwesomeIcon icon={["fas", "wallet"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Status"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
                                            {data.pending}
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
                    <Card.Body className="p-1">
                        <Card.Text>
                            <Table style={{"margin": "0px"}}>
                                <tbody>
                                    <tr>
                                        <img src="/sad.png" alt="" width="20%" />
                                    </tr>
                                    <tr style={{ "line-height": "20px" }}>
                                        <td class="cell-fit-card" style={{ "borderTop": "none", "width": "100%" }}>
                                            {error}
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

    onChangePage(paginator) {
        if (this.state.current_page !== paginator.current_page) {
            this.setState({
                current_page: paginator.current_page,
            });
            this.searchValue(this.state.search_value, paginator.current_page, "history");
        }
    }

    render() {
        const { search_value, search_header, search_response, searching_address, error_value, loading } = this.state;

        let searchResultPanel;
        if (error_value === "") {
            if (searching_address) {
                searchResultPanel = <AddressPanel address={search_value}/>;
            }
            else if (loading) {
                searchResultPanel = <Spinner animation="border" />;
            }
            else {
                if (search_response.response_type === "pending") {
                    searchResultPanel = this.generateTransactionPanel(search_response);
                }
                else if (search_response.response_type === "block") {
                    searchResultPanel = <BlockPanel data={search_response.block}/>;
                }
                else if (search_response.response_type === "data_request_report") {
                    searchResultPanel = <DataRequestReport data={search_response.data_request_report}/>;
                }
                else if (search_response.response_type === "data_request_history") {
                    // All data requests have the same DRO parameters
                    if (search_response.data_request_history.hasOwnProperty("data_request_parameters")) {
                        searchResultPanel = (
                            <DataRequestHistoryPanel
                                pagination={search_header} 
                                data={search_response.data_request_history}
                                current_page={this.state.current_page}
                                page_callback={this.onChangePage}
                                loading_next_page={this.state.loading_next_page}
                            />
                        );
                    }
                    // Data requests have different DRO parameters
                    else {
                        searchResultPanel = (
                            <RadHistoryPanel
                                pagination={search_header}
                                data={search_response.data_request_history}
                                current_page={this.state.current_page}
                                page_callback={this.onChangePage}
                                loading_next_page={this.state.loading_next_page}
                            />
                        );
                    }
                }
                else if (search_response.response_type === "mint") {
                    searchResultPanel = <MintPanel data={search_response.mint}/>;
                }
                else if (search_response.response_type === "value_transfer") {
                    searchResultPanel = <ValueTransferPanel data={search_response.value_transfer}/>;
                }
                else if (search_response.response_type === "data_request") {
                    searchResultPanel = <DataRequest data={search_response.data_request}/>;
                }
                else if (search_response.response_type === "commit") {
                    searchResultPanel = <Commit data={[search_response.commit]} />;
                }
                else if (search_response.response_type === "reveal") {
                    searchResultPanel = <Reveal data={[search_response.reveal]} />;
                }
                else if (search_response.response_type === "tally") {
                    searchResultPanel = <Tally data={search_response.tally} />;
                }
            }
        }
        else {
            searchResultPanel = this.generateErrorPanel(error_value);
        }

        return (
            <Container fluid style={{ paddingLeft: "50px", paddingRight: "50px", height: "95%" }}>
                <HistoryTypeahead/>
                {searchResultPanel}
            </Container>
        );
    };
}
