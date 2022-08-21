import React, { Component } from "react";
import { Card, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Info extends Component {
    render() {
        return(
            <Container>
                <Card className="shadow mb-3 bg-white rounded">
                    <Table responsive style={{borderCollapse: "separate", marginBottom: "0rem", paddingLeft: "3rem"}}>
                        <tbody style={{display: "block", maxHeight: "40vh", overflow: "auto"}}>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span>
                                        <FontAwesomeIcon icon={['fas', 'desktop']} style={{marginRight: "0.25rem"}} size="sm"/>
                                    </span>
                                    <span>
                                        {"Official website and overview"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"https://witnet.io"}>{"https://witnet.io"}</a>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"https://witnet.io/about"}>{"https://witnet.io/about"}</a>
                                    </span>
                                </td>
                            </tr>
                            <tr/>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span>
                                        <FontAwesomeIcon icon={['fas', 'wallet']} style={{marginRight: "0.25rem"}} size="sm"/>
                                    </span>
                                    <span>
                                        {"Official desktop wallet for Linux, Mac and Windows"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"https://sheikah.app"}>{"https://sheikah.app"}</a>
                                    </span>
                                </td>
                            </tr>
                            <tr/>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span>
                                        <FontAwesomeIcon icon={['fas', 'book']} style={{marginRight: "0.25rem"}} size="sm"/>
                                    </span>
                                    <span>
                                        {"Community maintained documentation"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"https://docs.witnet.io"}>{"https://docs.witnet.io"}</a>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
                <Card className="shadow mb-3 bg-white rounded">
                    <Table responsive style={{borderCollapse: "separate", marginBottom: "0rem", paddingLeft: "3rem"}}>
                        <tbody style={{display: "block", maxHeight: "40vh", overflow: "auto"}}>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span>
                                        <FontAwesomeIcon icon={['far', 'address-card']} style={{marginRight: "0.25rem"}} size="sm"/>
                                    </span>
                                    <span>
                                        {"Contact me"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"mailto: drcpu@protonmail.com"}>{"drcpu@protonmail.com"}</a>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"https://github.com/drcpu-github"}>{"https://github.com/drcpu-github"}</a>
                                    </span>
                                </td>
                            </tr>
                            <tr/>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span>
                                        <FontAwesomeIcon icon={['fab', 'osi']} style={{marginRight: "0.25rem"}} size="sm"/>
                                    </span>
                                    <span>
                                        {"Source code (version 1.3)"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"https://github.com/drcpu-github/witnet-explorer-backend"}>{"https://github.com/drcpu-github/witnet-explorer-backend"}</a>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        <a href={"https://github.com/drcpu-github/witnet-explorer-frontend"}>{"https://github.com/drcpu-github/witnet-explorer-frontend"}</a>
                                    </span>
                                </td>
                            </tr>
                            <tr/>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span>
                                        <FontAwesomeIcon icon={['fas', 'hand-holding-usd']} style={{marginRight: "0.25rem"}} size="sm"/>
                                    </span>
                                    <span>
                                        {"Donations to keep the explorer running are always welcome"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        {"BTC 1DNXyT83VJeUVuZSp7eu8bxjBGTWmrbdeV"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        {"ETH 0xf8FD5c2F5fb7436455FA1671683b6379dBA4F472"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="cell-fit" style={{border: "none"}}>
                                    <span style={{paddingLeft: "3rem"}}>
                                        {"WIT wit1wnulrrj42jelsnhgm6u286marclem2s9456hhu"}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            </Container>
        );
    }
}
