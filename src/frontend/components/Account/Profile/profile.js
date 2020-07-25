import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import  ProfileData from '../../Templates/Profiles/profileData';
import Spinners from '../../common/Spinner/spinner';
import { Container } from 'semantic-ui-react';
import { retrieveAppRecord, retrieveRecord } from '../../../utils/ThreadDB'

import "./profile.css"

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            profileId: '',
            member: '',
            firstName: '',
            lastName: '',
            avatar: '',
            profilePrivacy: true,
            exists: false
        }
    }

    componentDidMount() {
        this.loadData()
        .then((result) => {
            console.log('result', result)
            if(result) {
                this.setState({
                    loaded:true,
                    profileId: result._id,
                    member: result.member,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    avatar: result.avatar,
                    profilePrivacy: result.privacy,
                    exists: true
                })
            } 
        })
    }

    async loadData() {
        let profileId = this.props.history.location.pathname.slice(8)
        console.log('profileid', profileId)
        console.log('profiles here ', this.props.profiles)
        let record = await retrieveAppRecord(profileId, 'Profile')
        if(!record) {
            record = await retrieveRecord(profileId, 'Profile')
        }
        console.log('profile record', record)
        if(record !== undefined) {
            return record
        } else {
            console.log('no profile record')

        }    
    }

    render() {
        let {
            profiles,
            login,
            loaded,
            accountId,
            history,
            contract,
            handleChange,
            handleDateChange,
        } = this.props

        let { profileId, member, firstName, lastName, avatar, profilePrivacy, exists } = this.state
        let page = (
            
                <Spinners />
  
        )
        if (loaded === false) {
            return <div>{page}</div>
        } else {
            if (!exists) { return <Redirect to="/edit-profile" /> }
        }
           page = (
            <ProfileData
                profileId={profileId}
                firstName={firstName}
                lastName={lastName}
                avatar={avatar}
                member={member}
                accountId={accountId}
                history={history}
                contract={contract}
                handleChange={handleChange}
                handleDateChange={handleDateChange}
                profiles={profiles}
                profilePrivacy={profilePrivacy}
            />
           )
        
        
        if (loaded && !login) { return <Redirect to="/" /> }
        if (!profiles) { return <Redirect to="/members" /> }
        
        return (
            <Container>                
                   {page}
            </Container>
        )
    }
}

export default withRouter(Profile)