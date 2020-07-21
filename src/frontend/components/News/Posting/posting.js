import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Progress, Container } from 'semantic-ui-react';

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
            let {newsPostId, newsVerificationHash, published, handleChange, contract, newsPosts} = this.props
            console.log("**newsPostId", newsPostId, "**newsVerificationhash", newsVerificationHash, "**published", published)
            if(newsPostId && newsVerificationHash) {
            contract.postNewsPost({
                newsPostId: newsPostId,
                newsVerificationHash: newsVerificationHash,
                published: published.toString()
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
        let { newsPostTitle, login, loaded, newsPostId } = this.props
       
        if (loaded && !login) {return <Redirect to="/" />}
        if (!this.state.running) { return <Redirect to={{ pathname: "/@" + newsPostId }} /> }
       // if (!this.state.running) { return <Redirect to="/" /> }
        return (
                
                <Container className="main">
                    <h3>Posting News...</h3>
                    <div className="logging-screen">
                        <Progress percent={this.state.percent} autoSuccess />
                    </div>
                </Container>
                
            )
    }
}

export default Posting
