import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Progress, Container } from 'semantic-ui-react';

import './commenting.css';

class Commenting extends Component {
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
            let {commentId, commentVerificationHash, commentParent, commentPublished, handleChange, contract, comments} = this.props
            console.log('commenting state', this.state);
            console.log("**commentId", commentId, "**commentVerificationhash", commentVerificationHash, "**published", commentPublished, "**comment parent", commentParent)
            if(commentId && commentVerificationHash && commentParent) {
            contract.addComment({
                commentId: commentId,
                commentParent: commentParent,
                commentVerificationHash: commentVerificationHash,
                published: commentPublished.toString()
            }, process.env.DEFAULT_GAS_VALUE).then(response => {
                console.log("[commenting.js] commenting", response)
                let comment = response
                let newComments = comments.concat(comment)
                console.log('newcomments', newComments)
                handleChange({ name: "comments", value: newComments })
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
        let { commentParent, login, loaded } = this.props
       
        if (loaded && !login) {return <Redirect to="/" />}
        if (!this.state.running) { return <Redirect to={{ pathname: "/@" + commentParent }} /> }
       // if (!this.state.running) { return <Redirect to="/" /> }
        return (
                
                <Container className="main">
                    <h3>Adding Comment...</h3>
                    <div className="logging-screen">
                        <Progress percent={this.state.percent} autoSuccess />
                    </div>
                </Container>
                
            )
    }
}

export default Commenting
