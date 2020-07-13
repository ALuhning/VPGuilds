//import "regenerator-runtime/runtime";
import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

import App from "./App/app";

class AppBuilder extends Component {
    render() {
        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <App contract={this.props.contract} wallet={this.props.wallet} account={this.props.account} />
            </BrowserRouter>
        );
    }
}

export default AppBuilder;