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
            loading: true,
            error_value: "",
            last_updated: "",
            window_width: 0,
            window_height: 0,
            rows_per_page: 0,
            current_page: 1,
            total_pages: 0,
            balances: [],
            balance_rows: [],
        }

        this.getBalances = this.getBalances.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    getBalances() {
        DataService.getBalances(this.state.balance_rows.length, this.state.balance_rows.length + 1000)
        .then(response => {
            var new_balance_rows = this.generateBalanceRows(response.balance_list, response.balances_sum);
            this.setState({
                balances: [...this.state.balances, ...response.balance_list],
                balance_rows: [...this.state.balance_rows, ...new_balance_rows],
                total_pages: this.state.total_pages + Math.ceil(new_balance_rows.length / this.state.rows_per_page),
                loading: false,
                error_value: "",
                last_updated: TimeConverter.convertUnixTimestamp(response.last_updated, "hour")
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
            var api_link = "/search/" + balance[0];
            var balance_link = <Link to={api_link}>{balance[0]}</Link>

            return (
                <tr style={{"line-height": "20px"}}>
                    <td className="cell-fit cell-truncate" style={{"width": "30%"}}>
                        {balance_link}
                    </td>
                    <td className="cell-fit" style={{"width": "10%"}}>
                        {balance[1].toLocaleString()}
                    </td>
                    <td className="cell-fit" style={{"width": "10%"}}>
                        {parseFloat(balance[1] / balances_sum * 100).toFixed(5)+"%"}
                    </td>
                    <td className="cell-fit" style={{"width": "50%", "white-space": "nowrap"}}>
                        {balance[2]}
                    </td>
                </tr>
            );
        })

        return balance_rows;
    }

    onChangePage(paginator) {
        this.setState({
            current_page: paginator.current_page
        });

        if (paginator.current_page >= this.state.total_pages - 2) {
            this.getBalances();
        }
    }

    generateBalancesCard(){
        var row_start = (this.state.current_page - 1) * this.state.rows_per_page;
        var row_stop = this.state.current_page * this.state.rows_per_page;

        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        <Table hover responsive>
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
                                {this.state.balance_rows.slice(row_start, row_stop)}
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
                <Card.Text style={{paddingLeft: "1.25rem", paddingRight: "1.25rem", position: "relative"}}>
                    <small className="text-muted" style={{position: "absolute", bottom: 0}}>
                        Last updated: {this.state.last_updated}
                    </small>
                    <Paginator key={"paginator-" + this.state.balance_rows.length} items={this.state.balance_rows.length} itemsPerPage={this.state.rows_per_page} pageStart={this.state.current_page} onChangePage={this.onChangePage}/>
                </Card.Text>
            </Card>
        );
    }

    updateWindowDimensions() {
        this.setState({
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            rows_per_page: Math.floor(window.innerHeight * 0.7 / 20)
        });
    }

    componentDidMount() {
        this.getBalances();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    render() {
        const { loading, error_value } = this.state;

        let balances_card;
        if (error_value === "") {
            if (loading) {
                balances_card = <SpinnerCard/>;
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
