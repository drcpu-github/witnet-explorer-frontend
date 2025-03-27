import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Container, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorCard from "../Components/ErrorCard";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class Staking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            validator_data: [],
            sort_field: "",
            sort_order: "",
            last_updated: "",
            error_value: "",
            table_style: {},
        };

        this.addExtraData = this.addExtraData.bind(this);
        this.getStakes = this.getStakes.bind(this);
        this.sortTable = this.sortTable.bind(this);
        this.updateTableDimensions = this.updateTableDimensions.bind(this);
    }

    getStakes() {
        DataService.getStakes()
            .then((response) => {
                this.setState({
                    loading: false,
                    validator_data: this.addExtraData(response.stakes),
                    sort_field: "current_stake",
                    sort_order: "desc",
                    last_updated: TimeConverter.convertUnixTimestamp(response.last_updated, "full"),
                    error_value: "",
                });
            })
            .catch((e) => {
                console.log(e);
                this.setState({
                    error_value: "Could not fetch validator data!",
                });
            });
    }

    addExtraData(stakes) {
        var now = Math.floor(Date.now() / 1000);
        var one_year = 365 * 24 * 60 * 60;

        return stakes.map(function (stake) {
            var time_since_genesis = now - stake.genesis;
            stake.score = (((stake.rewards / stake.time_weighted_stake) * one_year) / time_since_genesis) * 100;

            return stake;
        });
    }

    generateValidatorCard() {
        const sort_icon = (
            <FontAwesomeIcon icon={["fas", "sort"]} style={{ marginLeft: "0.25rem" }} size="sm" fixedWidth />
        );
        const sort_direction_icon =
            this.state.sort_order === "asc" ? (
                <FontAwesomeIcon icon={["fas", "sort-up"]} style={{ marginLeft: "0.25rem" }} size="sm" fixedWidth />
            ) : (
                <FontAwesomeIcon icon={["fas", "sort-down"]} style={{ marginLeft: "0.25rem" }} size="sm" fixedWidth />
            );

        return (
            <Card className="shadow bg-white rounded" style={{ height: "85vh" }}>
                <Card.Body className="pl-3 pt-3 pr-3 pb-0">
                    <Card.Text>
                        <Table striped hover responsive style={this.state.table_style}>
                            <thead className="th-fixed">
                                <tr style={{ "line-height": "25px" }}>
                                    <th
                                        className="cell-fit"
                                        style={{ textAlign: "left", width: "40%" }}
                                        onClick={() => this.sortTable("validator")}
                                    >
                                        {"Validator"}
                                        {this.state.sort_field === "validator" ? sort_direction_icon : sort_icon}
                                    </th>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="genesis">{"The time of the first stake transaction"}</Tooltip>
                                        }
                                    >
                                        <th
                                            className="cell-fit"
                                            style={{ textAlign: "center", width: "10%" }}
                                            onClick={() => this.sortTable("genesis")}
                                        >
                                            {"Genesis"}
                                            {this.state.sort_field === "genesis" ? sort_direction_icon : sort_icon}
                                        </th>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="last_active">
                                                {"The time of the last proposed block or solved data request"}
                                            </Tooltip>
                                        }
                                    >
                                        <th
                                            className="cell-fit"
                                            style={{ textAlign: "right", width: "10%" }}
                                            onClick={() => this.sortTable("last_active")}
                                        >
                                            {"Last active"}
                                            {this.state.sort_field === "last_active" ? sort_direction_icon : sort_icon}
                                        </th>
                                    </OverlayTrigger>
                                    <th
                                        className="cell-fit"
                                        style={{ textAlign: "right", width: "10%" }}
                                        onClick={() => this.sortTable("current_stake")}
                                    >
                                        {"Current stake"}
                                        {this.state.sort_field === "current_stake" ? sort_direction_icon : sort_icon}
                                    </th>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="last_active">
                                                {"The sum of all block rewards and transaction fees received"}
                                            </Tooltip>
                                        }
                                    >
                                        <th
                                            className="cell-fit"
                                            style={{ textAlign: "right", width: "10%" }}
                                            onClick={() => this.sortTable("rewards")}
                                        >
                                            {"Rewards"}
                                            {this.state.sort_field === "rewards" ? sort_direction_icon : sort_icon}
                                        </th>
                                    </OverlayTrigger>
                                    <th
                                        className="cell-fit"
                                        style={{ textAlign: "right", width: "5%" }}
                                        onClick={() => this.sortTable("blocks")}
                                    >
                                        {"Blocks"}
                                        {this.state.sort_field === "blocks" ? sort_direction_icon : sort_icon}
                                    </th>
                                    <th
                                        className="cell-fit"
                                        style={{ textAlign: "right", width: "5%" }}
                                        onClick={() => this.sortTable("data_requests")}
                                    >
                                        {"Data requests"}
                                        {this.state.sort_field === "data_requests" ? sort_direction_icon : sort_icon}
                                    </th>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="last_active">
                                                {
                                                    "The amount of times a validator was slashed for revealing an out-of-consensus value"
                                                }
                                            </Tooltip>
                                        }
                                    >
                                        <th
                                            className="cell-fit"
                                            style={{ textAlign: "right", width: "5%" }}
                                            onClick={() => this.sortTable("lies")}
                                        >
                                            {"Slashes"}
                                            {this.state.sort_field === "lies" ? sort_direction_icon : sort_icon}
                                        </th>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="last_active">
                                                {
                                                    "The rewards a validator received compared to its average stake over time"
                                                }
                                            </Tooltip>
                                        }
                                    >
                                        <th
                                            className="cell-fit"
                                            style={{ textAlign: "right", width: "5%" }}
                                            onClick={() => this.sortTable("score")}
                                        >
                                            {"Score"}
                                            {this.state.sort_field === "score" ? sort_direction_icon : sort_icon}
                                        </th>
                                    </OverlayTrigger>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.validator_data.map(function (data) {
                                    var validator_link = <Link to={"/search/" + data.validator}>{data.validator}</Link>;

                                    return (
                                        <tr style={{ "line-height": "20px" }}>
                                            <td
                                                className="cell-fit cell-truncate"
                                                style={{ textAlign: "left", width: "40%" }}
                                            >
                                                {validator_link}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "center", width: "10%" }}>
                                                {TimeConverter.convertUnixTimestamp(data.genesis, "full")}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "right", width: "10%" }}>
                                                {data.last_active === 0
                                                    ? "never"
                                                    : TimeConverter.convertUnixTimestamp(data.last_active, "full")}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "right", width: "10%" }}>
                                                {Formatter.formatWitValue(data.current_stake, 0)}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "right", width: "10%" }}>
                                                {Formatter.formatWitValue(data.rewards, 0)}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "right", width: "5%" }}>
                                                {Formatter.formatValue(data.blocks)}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "right", width: "5%" }}>
                                                {Formatter.formatValue(data.data_requests)}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "right", width: "5%" }}>
                                                {Formatter.formatValue(data.lies)}
                                            </td>
                                            <td className="cell-fit" style={{ textAlign: "right", width: "5%" }}>
                                                {Formatter.formatValueRound(data.score, 2) + "%"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="pl-3 pt-1 pr-3 pb-1">
                    <small className="text-muted">Last updated: {this.state.last_updated}</small>
                </Card.Footer>
            </Card>
        );
    }

    updateTableDimensions() {
        this.setState({
            table_style: {
                display: "block",
                height: window.innerHeight * 0.75 + "px",
                overflow: "scroll",
                margin: "0px",
            },
        });
    }

    componentDidMount() {
        this.updateTableDimensions();
        this.getStakes();
        window.addEventListener("resize", this.updateTableDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateTableDimensions);
    }

    sortTable(key) {
        const order = this.state.sort_field === key && this.state.sort_order === "asc" ? "desc" : "asc";

        this.setState({
            validator_data: []
                .concat(this.state.validator_data)
                .sort((a, b) => (a[key] > b[key] ? 1 : -1) * (order === "asc" ? 1 : -1)),
            sort_field: key,
            sort_order: order,
        });
    }

    render() {
        const { loading, error_value } = this.state;

        if (error_value === "") {
            return (
                <Container fluid style={{ paddingLeft: "50px", paddingRight: "50px" }}>
                    {loading ? <SpinnerCard height="85vh" /> : this.generateValidatorCard()}
                </Container>
            );
        } else {
            return (
                <Container fluid style={{ padding: "0px" }}>
                    <ErrorCard errorValue={error_value} />;
                </Container>
            );
        }
    }
}
