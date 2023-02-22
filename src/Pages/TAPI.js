import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { ResponsiveContainer, CartesianGrid, ComposedChart, XAxis, YAxis, Label, ReferenceLine, Tooltip, Bar } from "recharts";

import ErrorCard from "../Components/ErrorCard";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

export default class TAPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            error_value: "",
            tapi_data: {},
        };

        this.getTapi = this.getTapi.bind(this);
        this.generateTapiPanels = this.generateTapiPanels.bind(this);
    }

    getTapi() {
        DataService.getTapi()
        .then(response => {
            this.setState({
                loading: false,
                tapi_data: response,
            });
        })
        .catch(e => {
            console.log(e);
            this.setState({
                error_value: "Could not fetch TAPI data!"
            });
        });
    }

    generateTapiDetailsCard(tapi) {
        var start_time = TimeConverter.convertUnixTimestamp(tapi["start_time"], "full");
        var stop_time = TimeConverter.convertUnixTimestamp(tapi["stop_time"], "full");

        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{marginTop: "15px"}}>
                <Card.Body style={{ padding: "10px", height: "45vh"}}>
                    <Container fluid style={{"margin": "0rem", "padding": "0rem", "height": "45vh"}}>
                        <Table responsive style={{"display": "block", "overflow": "auto", "height": "45vh", "marginBottom": "0rem"}}>
                            <tbody>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {"Title"}
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {tapi["title"]}
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {"Description"}
                                    </td>
                                    <td style={{"border": "none", "word-wrap": "break-word", "padding": "0px"}}>
                                        {tapi["description"]}
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {"Start time"}
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {start_time + " (" + tapi["start_epoch"] + ")"}
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {"Stop time"}
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {stop_time + " (" + tapi["stop_epoch"] + ")"}
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {"Using bit"}
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {tapi["bit"]}
                                    </td>
                                </tr>
                                {
                                    tapi["urls"].map(function(url, idx){
                                        return (
                                            <tr style={{"line-height": "20px"}}>
                                                <td class="cell-fit" style={{"border": "none"}}>
                                                    {"WIP " + (idx + 1) + " URL"}
                                                </td>
                                                <td class="cell-fit" style={{"border": "none"}}>
                                                    <Link to={{pathname: url}} target="_blank">{url}</Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                                <tr style={{"line-height": "20px"}}><td style={{"border": "none"}}/></tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {"Relative acceptance"}
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {Formatter.formatValueRound(tapi["relative_acceptance_rate"], 2) + "%"}
                                    </td>
                                </tr>
                                <tr style={{"line-height": "20px"}}>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {"Global acceptance"}
                                    </td>
                                    <td class="cell-fit" style={{"border": "none"}}>
                                        {Formatter.formatValueRound(tapi["global_acceptance_rate"], 2) + "%"}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Container>
                </Card.Body>
            </Card>
        );
    }

    generateTapiAcceptanceGraph(acceptance_rates) {
        return (
            <Card className="h-100 shadow p-2 mb-2 bg-white rounded" style={{marginTop: "15px"}}>
                <Card.Body style={{ padding: 0, height: "45vh" }}>
                    <ResponsiveContainer width="100%">
                        <ComposedChart data={acceptance_rates} margin={{top: 10, right: 10, left: 10, bottom: 10}} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="label" tick={false}>
                                <Label value="Epochs elapsed" offset={10} position="insideBottom" style={{ textAnchor: "middle" }}/>
                            </XAxis>
                            <YAxis width={40}>
                                <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
                                    {"Acceptance rate (%)"}
                                </Label>
                            </YAxis>
                            <Tooltip formatter={(value) => value.toFixed(2) + "%"}/>
                            <Bar name="Global" dataKey="global_rate" fill="#0bb1a5" stroke="#0bb1a5" isAnimationActive={false}/>
                            <Bar name="Relative" dataKey="relative_rate" fill="#53378c" stroke="#53378c" isAnimationActive={false}/>
                            <Bar name="Periodic" dataKey="periodic_rate" fill="#12243a" stroke="#12243a" isAnimationActive={false}/>
                            <ReferenceLine y={80} stroke="#0bb1a5" strokeWidth={3} strokeDasharray="3 3" isFront={true}/>
                        </ComposedChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    generateTapiAcceptanceScatter(title, scatter_data) {
        if (scatter_data === "The TAPI did not start yet" || scatter_data === "Could not find TAPI plot") {
            return (
                <Card className="shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px", width: "100%" }}>
                    <Card.Body style={{ padding: "10px", height: "25vh" }}>
                        {scatter_data}
                    </Card.Body>
                </Card>
            );
        }
        else {
            return (
                <Card className="shadow p-2 mb-2 bg-white rounded" style={{ marginTop: "15px", width: "100%" }}>
                    <Card.Body style={{ padding: "10px", height: "25vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img className="img-pixels" src={`data:image/png;base64,${scatter_data}`} alt={"Scatter plot for TAPI of " + title}/>
                    </Card.Body>
                </Card>
            );
        }
    }

    generateTapiPanels() {
        // First set the default active TAPI to the first one
        let activeTapi;
        if (Object.keys(this.state.tapi_data).length > 0) {
            const first_key = Object.keys(this.state.tapi_data)[0];
            activeTapi = this.state.tapi_data[first_key]["title"].replace(" ", "_");
        }
        else {
            activeTapi = "";
        }
        // Check if there is an active one and, if so, set that one as default active
        for (var key in this.state.tapi_data) {
            if (this.state.tapi_data[key]["active"] === true){
                activeTapi = this.state.tapi_data[key]["title"].replace(" ", "_");
            }
        }

        return (
            <Tabs defaultActiveKey={activeTapi} id="uncontrolled-tab-example">
                {
                    Object.keys(this.state.tapi_data).map(function(key, index){
                        let tapi = this.state.tapi_data[key];
                        let tapi_details = this.generateTapiDetailsCard(tapi);
                        let tapi_graph = this.generateTapiAcceptanceGraph(tapi["rates"]);
                        let tapi_scatter = this.generateTapiAcceptanceScatter(tapi["title"], tapi["plot"]);
                        return (
                            <Tab eventKey={tapi["title"].replace(" ", "_")} title={tapi["title"]}>
                                <Row>
                                    <Col className="mb-3">
                                        {tapi_details}
                                    </Col>
                                    <Col className="mb-3">
                                        {tapi_graph}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {tapi_scatter}
                                    </Col>
                                </Row>
                            </Tab>
                        )
                    }, this)
                }
            </Tabs>
        );
    }

    componentDidMount() {
        this.getTapi();
    }

    render() {
        const { loading, error_value } = this.state;

        let tapiPanels;
        if (error_value === "") {
            if (loading) {
                tapiPanels = <SpinnerCard height="85vh"/>;
            }
            else{
                tapiPanels = this.generateTapiPanels();
            }
        }
        else {
            tapiPanels = <ErrorCard errorValue={error_value}/>;
        }

        return(
            <Container fluid>
                {tapiPanels}
            </Container>
        );
    }
}
