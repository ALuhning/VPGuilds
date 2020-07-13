import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Progress } from 'semantic-ui-react';

import './posting.css';

class Posting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            running: true,
            loaded: false,
            percent: 0
        }
    }

    componentDidMount() {
        this.loadData().then(() => {
            this.setState({loaded:true})
            let {newsPostId, newsVerificationHash, handleChange, contract, newsPosts} = this.props
            console.log("**newsPostId", newsPostId, "**newsVerificationhash", newsVerificationHash)
            if(newsPostId && newsVerificationHash) {
            contract.postNewsPost({
                newsPostId: newsPostId,
                newsVerificationHash: newsVerificationHash,
            }, process.env.DEFAULT_GAS_VALUE).then(response => {
                console.log("[posting.js] posting", response)
                let newsPost = response
                let newNewsPosts = newsPosts.concat(newsPost)
                handleChange({ name: "newsPosts", value: newNewsPosts })
                this.setState({
                    running:false,
                    percent: 100
                })
            }).catch(err => {
                console.log(err);
            })
            }
        })
      
    }

    async loadData() {
    }
        
    render() {
        let { newsPostTitle, login, load, newsPostId } = this.props
       
        if (load && !login) {return <Redirect to="/" />}
       // if (!this.state.running) { return <Redirect to={{ pathname: "/@" + newsPostTitle, hash: newsPostId }} /> }
        if (!this.state.running) { return <Redirect to="/" /> }
        return (
                <div>
                    <h3>Posting News...</h3>
                    <div className="logging-screen">
                        <Progress percent={this.state.percent} autoSuccess />
                    </div>
                </div>
            )
    }
}

export default Posting
