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
                <Tab eventKey="data_request_txn" title="Data request">
                    <DataRequest data={this.props.data.data_request_txn}/>
                </Tab>
                <Tab eventKey="commit_txn" title="Commit">
                    <Commit data={this.props.data.commit_txns}/>
                </Tab>
                <Tab eventKey="reveal_txn" title="Reveal">
                    <Reveal data={this.props.data.reveal_txns}/>
                </Tab>
                <Tab eventKey="tally_txn" title="Tally">
                    <Tally data={this.props.data.tally_txn}/>
                </Tab>
            </Tabs>
        )
    }
}
