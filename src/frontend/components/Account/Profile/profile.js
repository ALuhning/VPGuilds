import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import  ProfileData from '../../Templates/Profiles/profileData';
import Spinners from '../../common/Spinner/spinner';
import { Container, Segment } from 'semantic-ui-react';
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
            exists: true
        }
    }

    componentDidMount() {
        this.loadData()
        .then((result) => {
            if(!result) {
                let memberAccount = this.props.history.location.pathname.slice(8)
                let profileId = this.props.history.location.hash.slice(1)
                this.props.handleChange({ name: "profileId", profileId })
                this.setState({ 
                    profileId: profileId,
                    memberAccount: memberAccount,
                    exists: false
                })
                console.log('memberaccount', this.state.memberAccount)
                console.log('profileId', this.state.profileId)
            }
            
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
        let profileId = this.props.history.location.hash.slice(1)
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
            members,
        } = this.props

        let { profileId, member, memberAccount, firstName, lastName, avatar, profilePrivacy, exists } = this.state
        console.log('profile state', this.state)
        let page;
        if (loaded && !login) { return <Redirect to="/" /> }
        console.log('profile Id', this.state.profileId)
        if (exists === false  && memberAccount === accountId) { 
            return <Redirect to={{ 
                pathname: "/edit-profile-" + memberAccount, 
                hash: profileId
            }} /> 
        }
        
        if (loaded === false) {
            return <div><Spinners /></div>
        } else {
            page = (
                <ProfileData
                    profileId={profileId}
                    firstName={firstName}
                    lastName={lastName}
                    avatar={avatar}
                    member={member}
                    members={members}
                    accountId={accountId}
                    history={history}
                    contract={contract}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    profiles={profiles}
                    profilePrivacy={profilePrivacy}
                />
              
               )
        }        
        
        return (
            <Container>                
                   {page}
            </Container>
        )
    }
}

export default withRouter(Profile)