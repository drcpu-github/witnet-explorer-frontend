import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Container, Pagination, Spinner, Table } from "react-bootstrap";

import DataService from "../Services/DataService";
import TimeConverter from "../Services/TimeConverter";

export default class Richlist extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error_value: "",
            last_updated: "",
            page_x: 1,
            page_y: 2,
            page_z: 3,
            current_page: 1,
            window_width: 0,
            window_height: 0,
            rows_per_page: 0,
            total_pages: 0,
            balances: [],
            balance_rows: [],
        }

        this.onClick = this.onClick.bind(this);
        this.getRichlist = this.getRichlist.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    getRichlist() {
        DataService.getRichlist(this.state.balance_rows.length, this.state.balance_rows.length + 1000)
        .then(response => {
            this.richlist_rows = this.generateRichlistRows(response.richlist, response.balances_sum);
            this.setState({
                loading: false,
                error_value: "",
                last_updated: TimeConverter.convertUnixTimestamp(response.last_updated, "hour")
            });
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value: "Could not fetch rich list!"
            });
        });
    }

    onClick(event) {
        var previous_current_page = this.state.current_page;
        if (event.target.id === "first") {
            this.setState({
                page_x: 1,
                page_y: 2,
                page_z: 3,
                current_page: 1,
            });
        }
        else if (event.target.id === "previous") {
            this.setState({
                page_x: previous_current_page > 2 ? previous_current_page - 2 : previous_current_page - 1,
                page_y: previous_current_page > 2 ? previous_current_page - 1 : previous_current_page,
                page_z: previous_current_page > 2 ? previous_current_page : previous_current_page + 1,
                current_page: previous_current_page > 1 ? previous_current_page - 1 : previous_current_page,
            });
        }
        else if (event.target.id === "next") {
            this.setState({
                page_x: previous_current_page < this.state.total_pages - 2 ? previous_current_page : previous_current_page - 1,
                page_y: previous_current_page < this.state.total_pages - 2 ? previous_current_page + 1 : previous_current_page,
                page_z: previous_current_page < this.state.total_pages - 2 ? previous_current_page + 2 : previous_current_page + 1,
                current_page: previous_current_page < this.state.total_pages - 1 ? previous_current_page + 1 : this.state.total_pages,
            });

            // Fetch next set of pages
            if (previous_current_page >= this.state.total_pages - 2) {
                this.getRichlist();
            }
        }
        else if (event.target.id === "last") {
            this.setState({
                page_x: this.state.total_pages - 2,
                page_y: this.state.total_pages - 1,
                page_z: this.state.total_pages,
                current_page: this.state.total_pages,
            });

            // Fetch next set of pages
            this.getRichlist();
        }
        else {
            var page_clicked = parseInt(event.target.id, 10);
            // Right boundary condition
            if (page_clicked === this.state.total_pages - 1 && previous_current_page === this.state.total_pages - 1) {
                this.setState({
                    page_x: this.state.total_pages - 2,
                    page_y: this.state.total_pages - 1,
                    page_z: this.state.total_pages,
                    current_page: this.state.total_pages,
                });
            }
            // Advance page to the left
            if (page_clicked < previous_current_page)
            {
                this.setState({
                    page_x: page_clicked > 2 ? page_clicked - 2 : page_clicked - 1,
                    page_y: page_clicked > 2 ? page_clicked - 1 : page_clicked,
                    page_z: page_clicked > 2 ? page_clicked : page_clicked + 1,
                    current_page: page_clicked,
                });
            }
            // Advance page to the right
            else if (page_clicked > previous_current_page) {
                this.setState({
                    page_x: page_clicked < this.state.total_pages - 2 ? page_clicked : page_clicked - 1,
                    page_y: page_clicked < this.state.total_pages - 2 ? page_clicked + 1 : page_clicked,
                    page_z: page_clicked < this.state.total_pages - 2 ? page_clicked + 2 : page_clicked + 1,
                    current_page: page_clicked,
                });
            }
            else {
                this.setState({
                    current_page: page_clicked,
                });
            }

            // Fetch next set of pages
            if (page_clicked >= this.state.total_pages - 2) {
                this.getRichlist();
            }
        }
    };

    generateRichlistRows(balances, balances_sum) {
        var new_balance_rows = balances.map(function(balance){
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

        this.setState({
            balances: [...this.state.balances, ...balances],
            balance_rows: [...this.state.balance_rows, ...new_balance_rows],
            total_pages: this.state.total_pages + Math.ceil(new_balance_rows.length / this.state.rows_per_page),
        });
    }

    generateRichlistCard(){
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
                    <Pagination style={{float: "right", marginBottom: "0rem"}}>
                        <Pagination.Item id={"first"} onClick={this.onClick} disabled={this.state.page_x <= 1}>
                            {"<<"}
                        </Pagination.Item>
                        <Pagination.Item id={"previous"} onClick={this.onClick} disabled={this.state.page_x <= 1}>
                            {"<"}
                        </Pagination.Item>
                        <Pagination.Item id={this.state.page_x} onClick={this.onClick} active={this.state.page_x === this.state.current_page}>
                            {this.state.page_x}
                        </Pagination.Item>
                        <Pagination.Item id={this.state.page_y} onClick={this.onClick} active={this.state.page_y === this.state.current_page}>
                            {this.state.page_y}
                        </Pagination.Item>
                        <Pagination.Item id={this.state.page_z} onClick={this.onClick} active={this.state.page_z === this.state.current_page}>
                            {this.state.page_z}
                        </Pagination.Item>
                        <Pagination.Item id={"next"} onClick={this.onClick} disabled={this.state.page_z >= this.state.total_pages}>
                            {">"}
                        </Pagination.Item>
                        <Pagination.Item id={"last"} onClick={this.onClick} disabled={this.state.page_z >= this.state.total_pages}>
                            {">>"}
                        </Pagination.Item>
                    </Pagination>
                </Card.Text>
            </Card>
        );
    }

    generateSpinnerCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        <Spinner animation="border" />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    generateErrorCard() {
        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{height: "85vh"}}>
                <Card.Body className="pt-3 pb-0">
                    <Card.Text>
                        <span>{this.state.error_value}</span>
                    </Card.Text>
                </Card.Body>
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
        this.getRichlist();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    render() {
        const { loading, error_value } = this.state;

        let richlist_list_card;
        if (error_value === "") {
            if (loading) {
                richlist_list_card = this.generateSpinnerCard();
            }
            else{
                richlist_list_card = this.generateRichlistCard();
            }
        }
        else {
            richlist_list_card = this.generateErrorCard();
        }

        return(
            <Container fluid>
                {richlist_list_card}
            </Container>
        );
    }
}
