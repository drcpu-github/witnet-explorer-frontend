import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Container, Table } from "react-bootstrap";

import DataRequestReport from "./SearchPages/RequestPages/DataRequestReport"
import AddressPanel from "./SearchPages/AddressPanel"
import BlockPanel from "./SearchPages/BlockPanel"
import MintPanel from "./SearchPages/MintPanel"
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
                    error_value: "Search value not found!"
                });
            });
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
                                            {data.status}
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
                            <Table>
                                <tbody>
                                    <tr style={{"line-height": "20px"}}>
                                        <td class="cell-fit-padding-very-wide" style={{"borderTop": "none"}}>
                                            <FontAwesomeIcon icon={["fas", "bolt"]} size="sm" style={{"marginRight": "0.25rem"}}/>{"Error"}
                                        </td>
                                        <td class="cell-fit-no-padding" style={{"borderTop": "none", "width": "100%"}}>
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
                if (search_response.status === "pending" || search_response.status === "unknown hash") {
                    searchResultPanel = this.generateTransactionPanel(search_response);
                }
                // If not, check if it was a block
                else if (search_response.type === "block") {
                    searchResultPanel = <BlockPanel data={search_response}/>;
                }
                // If not, check if it was a transaction related to a data request
                else if (search_response.type === "data_request_report") {
                    searchResultPanel = <DataRequestReport type={search_response.transaction_type} data={search_response}/>
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

        return(
            <div>
                <div style={{paddingLeft : "50px", paddingRight : "50px"}} className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search an address, transaction or block" search_value={search_value} onChange={this.onChangeSearch} onKeyPress={this.handleEnterPressed}/>
                    <div className="input-group-append">
                        <Link to={"/search/" + search_value} className="btn btn-outline-secondary">
                            <FontAwesomeIcon icon={['fas', 'search']} size="sm"/> Search
                        </Link>
                    </div>
                </div>
                <div style={{paddingLeft : "50px", paddingRight : "50px"}}>
                    {searchResultPanel}
                </div>
            </div>
        );
    };
}
