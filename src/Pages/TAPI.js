import React, { Component, PureComponent } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { ResponsiveContainer, CartesianGrid, ComposedChart, XAxis, YAxis, Label, ReferenceLine, Scatter, ScatterChart, Tooltip, Bar } from "recharts";

import ErrorCard from "../Components/ErrorCard";
import SpinnerCard from "../Components/SpinnerCard";

import DataService from "../Services/DataService";
import Formatter from "../Services/Formatter";
import TimeConverter from "../Services/TimeConverter";

class BlockTooltip extends PureComponent {
    render() {
        const { active, payload, start_epoch } = this.props;
        if (active && payload && payload.length) {
            const block = start_epoch + payload[0].payload.x + (27 - payload[0].payload.y) * 960;
            return (
                <div className="custom-tooltip">
                    <p className="label" style={{"padding": 0, "margin": 0}}>{`Block ${block}`}</p>
                    <p className="label" style={{"padding": 0, "margin": 0}}>{`Accept: ${payload[0].payload.accept}`}</p>
                </div>
            );
        }
        return null;
    }
};

class CustomScatterMarker extends PureComponent {
    render() {
        const { cx, cy, color } = this.props;
        const width = 2, height = 4;
        return (
            <svg width={width} height={height} style={{"overflow": "visible"}}>
                <rect x={cx} y={cy} width={width} height={height} stroke={color} strokeWidth="0" fill={color}/>
            </svg>
        );
    }
}

export default class TAPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            error_value: "",
            tapi_data: {},
        };

        this.initTapi = this.initTapi.bind(this);
        this.updateTapi = this.updateTapi.bind(this);
        this.generateTapiPanels = this.generateTapiPanels.bind(this);
    }

    initTapi() {
        DataService.initTapi()
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

    updateTapi() {
        DataService.updateTapi()
        .then(response => {
            // Create new map
            let tapi_update = {...this.state.tapi_data};
            // Remove the matching TAPI
            for (var key in tapi_update) {
                if (key === response["tapi_id"]) {
                    tapi_update.delete(key);
                    break;
                }
            }
            // Push the updated TAPI
            tapi_update[response["tapi_id"]] = response;
            this.setState({
                loading: false,
                tapi_data: tapi_update,
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
                <Card.Body style={{padding: "10px"}}>
                    <Container fluid style={{"margin": "0rem", "padding": "0rem", "height": "40vh"}}>
                        <Table responsive style={{"display": "block", "overflow": "auto", "height": "30vh", "marginBottom": "0rem"}}>
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
                <Card.Body style={{padding: "10px"}}>
                    <ResponsiveContainer width="100%" height="50%" minWidth={500} minHeight={300}>
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

    generateTapiAcceptanceScatter(start_epoch, grouped_acceptance) {
        // Convert acceptance 32-bit integers to binary
        var acceptance = [];
        for (let i = 0; i < grouped_acceptance.length - 1; i++) {
            let zero_padded_binary_str = grouped_acceptance[i].toString(2);
            zero_padded_binary_str = "0".repeat(32 - zero_padded_binary_str.length) + zero_padded_binary_str;
            acceptance.push(...zero_padded_binary_str.split(""));
        }
        acceptance.push(...grouped_acceptance[grouped_acceptance.length - 1].split(""));

        // Create accept and reject (tiled) lists for the scatter plot
        var accept = [], reject = [];
        for (let i = 0; i < 28; i++) {
            for (let j = 0; j < 960; j++) {
                if (acceptance[i * 960 + j] === "0") {
                    reject.push({x: j, y: 27-i, accept: "no"})
                }
                else if (acceptance[i * 960 + j] === "1") {
                    accept.push({x: j, y: 27-i, accept: "yes"})
                }
            }
        }

        return (
            <Card className="shadow p-2 mb-2 bg-white rounded" style={{marginTop: "15px", width: "100%"}}>
                <Card.Body style={{padding: "10px"}}>
                    <ResponsiveContainer width="100%" height={150}>
                        <ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                            <XAxis dataKey="x" type="number" tick={false} hide={true} height={5} domain={[0, 960]}/>
                            <YAxis dataKey="y" type="number" tick={false} hide={true} width={5} domain={[0, 28]}/>
                            <Tooltip content={<BlockTooltip start_epoch={start_epoch}/>}/>
                            <Scatter data={accept} fill="#0bb1a5" shape={<CustomScatterMarker color={"#0bb1a5"}/>} isAnimationActive={false}/>
                            <Scatter data={reject} fill="#12243a" shape={<CustomScatterMarker color={"#12243a"}/>} isAnimationActive={false}/>
                        </ScatterChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        );
    }

    generateTapiPanels() {
        // First set the default active TAPI to the first one
        let activeTapi;
        if ("1" in this.state.tapi_data) {
            activeTapi = this.state.tapi_data["1"]["title"].replace(" ", "_");
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
                        let tapi_scatter = this.generateTapiAcceptanceScatter(tapi["start_epoch"], tapi["accept"])
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
        this.initTapi();
        // run every 5 minutes
        this.interval_id = setInterval(this.updateTapi, 300000);
    }

    componentWillUnmount() {
        clearInterval(this.interval_id);
    }

    render() {
        const { loading, error_value } = this.state;

        let tapiPanels;
        if (error_value === "") {
            if (loading) {
                tapiPanels = <SpinnerCard/>;
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
