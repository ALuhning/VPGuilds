import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { retrieveAppRecord, retrieveRecord } from '../../../utils/ThreadDB'

import './avatar.css';

class Avatar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            exists: false,
            avatar: ''
        }
    }

    componentDidMount() {
        this.loadData().then((result) => {
            console.log('headernav', result)
            if(result) {
                this.setState({
                    exists:true,
                    avatar: result.avatar
                })
            }
        })
    }

    async loadData() {
        console.log('avatar profileId', this.props.profileId)
        let record = await retrieveAppRecord(this.props.profileId, 'Profile')
        if(!record) {
            record = await retrieveRecord(this.props.profileId, 'Profile')
        }
        console.log('profile record', record)
        if(record !== undefined) {
            return record
        } else {
            console.log('no profile record')
        }
    
    }

    render () {       
        let exists = this.state.exists
        return (
            exists ? <Image src={this.state.avatar} avatar as={Link} to={{ pathname: '/member-' + this.props.accountId, hash: this.props.profileId }} /> 
            : <Image src={require('../../../../assets/default-profile.png')} avatar as={Link} to={{ pathname: '/member-' + this.props.accountId, hash: this.props.profileId }}/>
        )
    }
    
}
export default Avatar;