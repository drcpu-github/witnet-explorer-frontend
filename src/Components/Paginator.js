import React, { Component } from "react";
import { Pagination } from "react-bootstrap";

class Paginator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            items_per_page: props.itemsPerPage,
            page_start: props.pageStart,
            paginator: {},
            paginator_size: 3,
        };
    }

    componentWillMount() {
        if (this.state.items > 0) {
            this.setPage(this.state.page_start);
        }
    }

    setPage(page) {
        var { items, items_per_page, paginator, paginator_size } = this.state;

        if (page < 1 || page > paginator.total_pages) {
            return;
        }

        paginator = this.getPaginator(items, items_per_page, page, paginator_size);

        this.setState({ paginator: paginator });

        this.props.onChangePage(paginator);
    }

    getPaginator(items, items_per_page, current_page, paginator_size) {
        var total_pages = Math.ceil(items / items_per_page);

        var first_page, last_page;
        if (total_pages <= 3) {
            first_page = 1;
            last_page = total_pages;
        }
        else {
            if (current_page <= 2) {
                first_page = 1;
                last_page = 3;
            }
            else if (current_page + 1 >= total_pages) {
                first_page = total_pages - 2;
                last_page = total_pages;
            }
            else {
                first_page = current_page - 1;
                last_page = current_page + 1;
            }
        }

        var pages = [...Array((last_page + 1) - first_page).keys()].map(i => first_page + i);

        return {
            items: items,
            current_page: current_page,
            paginator_size: paginator_size,
            total_pages: total_pages,
            first_page: first_page,
            last_page: last_page,
            pages: pages,
        };
    }

    render() {
        var paginator = this.state.paginator;

        if (!paginator.pages || paginator.pages.length <= 1) {
            return null;
        }

        return (
            <Pagination style={{float: "right", marginBottom: "0rem"}}>
                <Pagination.Item id={"first"} onClick={() => this.setPage(1)} disabled={paginator.current_page === 1}>
                    {"<<"}
                </Pagination.Item>
                <Pagination.Item id={"previous"} onClick={() => this.setPage(paginator.current_page - 1)} disabled={paginator.current_page === 1}>
                    {"<"}
                </Pagination.Item>
                {
                    paginator.pages.map((page) =>
                        <Pagination.Item id={page} onClick={() => this.setPage(page)} active={paginator.current_page === page}>
                            {page}
                        </Pagination.Item>
                    )
                }
                <Pagination.Item id={"next"} onClick={() => this.setPage(paginator.current_page + 1)} disabled={paginator.current_page === paginator.total_pages}>
                    {">"}
                </Pagination.Item>
                <Pagination.Item id={"last"} onClick={() => this.setPage(paginator.total_pages)} disabled={paginator.current_page === paginator.total_pages}>
                    {">>"}
                </Pagination.Item>
            </Pagination>
        );
    }
}

export default Paginator;
