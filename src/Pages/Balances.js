import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Container, Table } from "react-bootstrap";

import ErrorCard from "../Components/ErrorCard";
import Paginator from "../Components/Paginator";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import TimeConverter from "../Services/TimeConverter";

export default class Balances extends Component{
    constructor(props) {
        super(props);
        this.state = {
            intializing: true,
            loading: true,
            error_value: "",
            last_updated: "",
            current_page: 1,
            total_items: 0,
            total_pages: 0,
            items_per_page: 0,
            balance_rows: {},
        }

        this.getBalances = this.getBalances.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    getBalances(page) {
        DataService.getBalances(page)
            .then(response => {
                const pagination_header = JSON.parse(response[0].get("X-Pagination"));
                const json_response = response[1];
                var new_balance_rows = this.generateBalanceRows(json_response.balances, json_response.total_balance_sum);
                this.setState({
                    balance_rows: {
                        ...this.state.balance_rows,
                        [page]: new_balance_rows,
                    },
                    total_items: pagination_header.total,
                    total_pages: pagination_header.total_pages,
                    items_per_page: json_response.balances.length,
                    loading: false,
                    intializing: false,
                    error_value: "",
                    last_updated: TimeConverter.convertUnixTimestamp(json_response.last_updated, "hour")
                });
            })
            .catch(e => {
                console.log(e);
                this.setState({
                    error_value: "Could not fetch balance list!"
                });
            });
    }

    generateBalanceRows(balances, balances_sum) {
        var balance_rows = balances.map(function(balance){
            var api_link = "/search/" + balance.address;
            var balance_link = <Link to={api_link}>{balance.address}</Link>

            return (
                <tr style={{"line-height": "20px"}}>
                    <td className="cell-fit cell-truncate" style={{"width": "30%"}}>
                        {balance_link}
                    </td>
                    <td className="cell-fit" style={{"width": "10%"}}>
                        {balance.balance.toLocaleString()}
                    </td>
                    <td className="cell-fit" style={{"width": "10%"}}>
                        {parseFloat(balance.balance / balances_sum * 100).toFixed(5)+"%"}
                    </td>
                    <td className="cell-fit" style={{"width": "50%", "white-space": "nowrap"}}>
                        {balance.label}
                    </td>
                </tr>
            );
        })

        return balance_rows;
    }

    onChangePage(paginator) {
        this.setState({
            current_page: paginator.current_page,
        });

        if (!(paginator.current_page in this.state.balance_rows)) {
            this.setState({
                loading: true,
            });
            this.getBalances(paginator.current_page);
        }
    }

    generateBalancesCard(){
        const { balance_rows, current_page, items_per_page, last_updated, loading, total_items } = this.state;

        var row_start = (current_page - 1) * items_per_page;
        var row_stop = current_page * items_per_page;

        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        {
                            loading
                                ?   <SpinnerCard height="85vh" />
                                :   <Table
                                        hover
                                        responsive
                                        style={{
                                            "border-collapse": "separate",
                                            "display": "block",
                                            "height": "75vh", 
                                            "overflow-y": "scroll",
                                            "margin": "0px",
                                        }}
                                    >
                                        <thead>
                                            <tr style={{"line-height": "25px"}}>
                                                <th className="cell-fit" style={{"width": "30%"}}>
                                                    {"Addresses " + (row_start + 1) + " to " + row_stop}
                                                </th>
                                                <th className="cell-fit" style={{"width": "10%"}}>
                                                    {"Balance"}
                                                </th>
                                                <th className="cell-fit" style={{"width": "10%"}}>
                                                    {"Percentage"}
                                                </th>
                                                <th className="cell-fit" style={{"width": "50%", "white-space": "nowrap"}}>
                                                    {"Label"}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {balance_rows[current_page]}
                                        </tbody>
                                    </Table>
                        }
                    </Card.Text>
                </Card.Body>
                <Card.Text style={{paddingLeft: "1.25rem", paddingRight: "1.25rem", position: "relative"}}>
                    <small className="text-muted" style={{position: "absolute", bottom: 0}}>
                        Last updated: {last_updated}
                    </small>
                    <Paginator
                        key={"paginator-" + total_items}
                        items={total_items}
                        itemsPerPage={items_per_page}
                        pageStart={current_page}
                        onChangePage={this.onChangePage}
                    />
                </Card.Text>
            </Card>
        );
    }

    componentDidMount() {
        this.getBalances(1);
    }

    render() {
        const { intializing, error_value } = this.state;

        let balances_card;
        if (error_value === "") {
            if (intializing) {
                balances_card = <SpinnerCard height="85vh"/>;
            }
            else{
                balances_card = this.generateBalancesCard();
            }
        }
        else {
            balances_card = <ErrorCard errorValue={error_value}/>;
        }

        return(
            <Container fluid>
                {balances_card}
            </Container>
        );
    }
}
