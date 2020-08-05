import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Progress, Container } from 'semantic-ui-react';
import {deleteAppRecord, deleteRecord} from '../../../utils/ThreadDB'
import {NewsPost} from '../../../schemas/NewsPost'

import './deleting.css';

class Deleting extends Component {
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
            let {newsPostId, handleChange, contract } = this.props
            console.log("**newsPostId", newsPostId)
            if(newsPostId) {
              
                deleteAppRecord(newsPostId, 'NewsPost')
                deleteRecord(newsPostId, 'NewsPost')
                contract.deleteNewsPostProfile({
                    tokenId: newsPostId
                }, process.env.DEFAULT_GAS_VALUE).then(async (response) => {
                    console.log("[profile.js] posts", response.length)
                    console.log('response', response)
                //    let result = await contract.getAllNewsPosts();
                //    if (result.length != 0) {
                //        handleChange({ name: "newsPosts", value: result })
                //    }
                  
                }).catch(err => {
                    console.log(err);
                })
                }
                this.setState({
                    running:false,
                    percent: 100
                })
            }).catch(err => {
                console.log(err);
            })
    }


    async loadData() {
    }
        
    render() {
        let { newsPostTitle, login, loaded, newsPostId } = this.props
       
        if (loaded && !login) {return <Redirect to="/" />}
        if (!this.state.running) { return <Redirect to={{ pathname: "/" }} /> }
    
        return (
                
                <Container className="main">
                    <h3>Deleting News...</h3>
                    <div className="logging-screen">
                        <Progress percent={this.state.percent} autoSuccess />
                    </div>
                </Container>
                
            )
    }
}

export default Deleting
