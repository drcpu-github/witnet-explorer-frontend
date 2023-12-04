import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";

import DataRequest from "./DataRequest"
import Commit from "./Commit"
import Reveal from "./Reveal"
import Tally from "./Tally"

export default class DataRequestReport extends Component {
    render() {
        return (
            <Tabs defaultActiveKey={this.props.data.transaction_type} id="uncontrolled-tab-example">
                <Tab eventKey="data_request" title="Data request">
                    <DataRequest data={this.props.data.data_request}/>
                </Tab>
                <Tab eventKey="commit" title="Commit">
                    <Commit data={this.props.data.commits}/>
                </Tab>
                <Tab eventKey="reveal" title="Reveal">
                    <Reveal data={this.props.data.reveals}/>
                </Tab>
                <Tab eventKey="tally" title="Tally">
                    <Tally data={this.props.data.tally}/>
                </Tab>
            </Tabs>
        )
    }
}
