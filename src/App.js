import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap'

import Home from './Pages/Home';
import Search from './Pages/Search';
import Blockchain from './Pages/Blockchain';
import Transactions from './Pages/Transactions';
import Network from './Pages/Network';
import Reputation from './Pages/Reputation';
import Balances from './Pages/Balances';
import TAPI from './Pages/TAPI';
import Info from './Pages/Info';

class WitnetExplorer extends React.Component{
    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <BrowserRouter>
                            <Navbar className="navbar-color" variant="dark" expand="lg" sticky="top">
                                <Navbar.Brand href="/">
                                    <img src="/explorer_logo.png" width="30" alt="" style={{"marginLeft": "0.5rem", "marginRight": "0.5rem"}}/>
                                    <span>Witnet Explorer</span>
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="mr-auto">
                                    <Nav.Link href="/search">Search</Nav.Link>
                                    <Nav.Link href="/blockchain">Blockchain</Nav.Link>
                                    <Nav.Link href="/transactions">Transactions</Nav.Link>
                                    <Nav.Link href="/network">Network</Nav.Link>
                                    <Nav.Link href="/reputation">Reputation</Nav.Link>
                                    <Nav.Link href="/balances">Balances</Nav.Link>
                                    <Nav.Link href="/tapi">TAPI</Nav.Link>
                                    <Nav.Link href="/info">Info</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                            <br />
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route exact path="/search" component={Search}/>
                                <Route exact path="/search/:hash" component={Search}/>
                                <Route path="/blockchain" component={Blockchain}/>
                                <Route path="/transactions" component={Transactions}/>
                                <Route path="/network" component={Network}/>
                                <Route path="/reputation" component={Reputation}/>
                                <Route path="/balances" component={Balances}/>
                                <Route path="/tapi" component={TAPI}/>
                                <Route path="/info" component={Info}/>
                            </Switch>
                        </BrowserRouter>
                    </div>
                </div>
            </div>
        )
    }
}

export default WitnetExplorer;