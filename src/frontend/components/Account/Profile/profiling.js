import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Progress, Container } from 'semantic-ui-react';

import './profile.css';
import { InvalidAccountId } from 'near-api-js/lib/utils/rpc_errors';

class Profiling extends Component {
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
            let {profileId, profileVerificationHash, profilePrivacy, handleChange, contract, profiles } = this.props
            console.log('profiles state', this.state);
            console.log("**profileId", profileId, "**profileVerificationhash", profileVerificationHash, "**privacy", profilePrivacy)
            if(profileId && profileVerificationHash) {
            contract.addProfile({
                profileId: profileId,
                profileVerificationHash: profileVerificationHash,
                privacy: profilePrivacy.toString()
            }, process.env.DEFAULT_GAS_VALUE).then(response => {
                console.log("[profiling.js] profiling", response)
                let profile = response
                let newProfiles = profiles.concat(profile)
                console.log('new profiles', newProfiles)
                handleChange({ name: "profiles", value: newProfiles })
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
        let { login, loaded } = this.props
       
        if (loaded && !login) {return <Redirect to="/" />}
        if (!this.state.running) { return <Redirect to={{ pathname: "/members" }} /> }
      
        return (
                
                <Container className="main">
                    <h3>Adding Profile...</h3>
                    <div className="logging-screen">
                        <Progress percent={this.state.percent} autoSuccess />
                    </div>
                </Container>
                
            )
    }
}

export default Profiling
