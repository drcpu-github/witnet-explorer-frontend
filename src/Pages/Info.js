import React, { Component } from "react";
import { Card, Container, Col, Row } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Info extends Component {
    render() {
        return(
            <Container>
                <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"85vh"}>
                    <Container style={{paddingLeft : "50px", paddingRight : "50px"}}>
                        <Card className="shadow p-2 mb-3 bg-white rounded">
                            <Container>
                                <Row>
                                    <Col xs={12}>
                                        <FontAwesomeIcon icon={['fas', 'desktop']} size="sm"/>{" Official website and overview"}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"https://witnet.io"}>{"https://witnet.io"}</a>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"https://witnet.io/about"}>{"https://witnet.io/about"}</a>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col xs={12}>
                                        <FontAwesomeIcon icon={['fas', 'wallet']} size="sm"/>{" Official desktop wallet for Linux, Mac and Windows"}
                                    </Col>
                                    <Col xs={6}>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"https://sheikah.app"}>{"https://sheikah.app"}</a>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col xs={12}>
                                        <FontAwesomeIcon icon={['fas', 'book']} size="sm"/>{" Community maintained documentation"}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"https://docs.witnet.io"}>{"https://docs.witnet.io"}</a>
                                    </Col>
                                </Row>
                            </Container>
                        </Card>
                    </Container>
                </Scrollbars>
                <Scrollbars hideTracksWhenNotNeeded autoHeight autoHeightMax={"85vh"}>
                    <Container style={{paddingLeft : "50px", paddingRight : "50px"}}>
                        <Card className="shadow p-2 mb-3 bg-white rounded">
                            <Container>
                                <Row>
                                    <Col xs={12}>
                                        <FontAwesomeIcon icon={['far', 'address-card']} size="sm"/>{" Contact me"}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"mailto: drcpu@protonmail.com"}>{"drcpu@protonmail.com"}</a>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"https://github.com/drcpu-github"}>{"https://github.com/drcpu-github"}</a>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col xs={12}>
                                        <FontAwesomeIcon icon={['fab', 'osi']} size="sm"/>{" Source code "}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"https://github.com/drcpu-github/witnet-explorer-backend"}>{"https://github.com/drcpu-github/witnet-explorer-backend"}</a>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        <a href={"https://github.com/drcpu-github/witnet-explorer-frontend"}>{"https://github.com/drcpu-github/witnet-explorer-frontend"}</a>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col xs={12}>
                                        <FontAwesomeIcon icon={['fas', 'hand-holding-usd']} size="sm"/>{" Donations to keep the explorer running are always welcome"}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        {"BTC 1DNXyT83VJeUVuZSp7eu8bxjBGTWmrbdeV"}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        {"ETH 0xf8FD5c2F5fb7436455FA1671683b6379dBA4F472"}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={1}>
                                        {""}
                                    </Col>
                                    <Col xs={11}>
                                        {"WIT wit1wnulrrj42jelsnhgm6u286marclem2s9456hhu"}
                                    </Col>
                                </Row>
                            </Container>
                        </Card>
                    </Container>
                </Scrollbars>
            </Container>
        );
    }
}
