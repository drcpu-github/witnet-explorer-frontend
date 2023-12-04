import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem, Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SearchHistory from "../Services/SearchHistory";

class HistoryTypeahead extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search_value: "",
        };
    }

    doSearch(value) {
        SearchHistory.addToHistory(value);
        window.open("/search/" + value, "_self");
    }

    render() {
        const { search_value } = this.state;

        return (
            <div className="input-group mb-3">
                <Typeahead
                    className="form-control"
                    style={{ "padding": 0 }}
                    id="search"
                    labelKey="search"
                    options={SearchHistory.getHistory()}
                    placeholder="Search an address, transaction, data request or block"
                    minLength={3}
                    onChange={(value) => {
                        this.setState({
                            search_value: value
                        });
                    }}
                    onInputChange={(value) => {
                        this.setState({
                            search_value: value
                        });
                    }}
                    onKeyDown={(event) => {
                        if (event.keyCode === 13) {
                            this.doSearch(this.state.search_value);
                        }
                    }}
                    renderMenu={(results, menuProps) => {
                        if (!results.length) {
                            return null;
                        }
                        return (
                            <Menu {...menuProps}>
                                {results.map((result, index) => {
                                    if (index > 5) {
                                        return null;
                                    }
                                    else {
                                        return (
                                            <MenuItem
                                                onClick={() => this.doSearch(result)}
                                                option={result}
                                                position={index}>
                                                {result}
                                            </MenuItem>
                                        );
                                    }
                                })}
                            </Menu>
                        );
                    }}
                    autoFocus
                    positionFixed
                />
                <div className="input-group-append">
                    <Link to={"/search/" + search_value} className="btn btn-outline-secondary">
                        <FontAwesomeIcon icon={['fas', 'search']} size="sm" style={{ "marginRight": "0.25rem" }} />{"Search"}
                    </Link>
                </div>
            </div>
        );
    }
}

export default HistoryTypeahead;
