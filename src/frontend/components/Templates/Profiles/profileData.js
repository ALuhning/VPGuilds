import React, { Component } from 'react';
import { Container, Segment, Header, Label, Image, Icon } from 'semantic-ui-react';
import { deleteAppRecord, deleteRecord } from '../../../utils/ThreadDB'


import './profileData.css'

class ProfileData extends Component {

    constructor(props) {
        super(props)
        this.state = {
            running: false
        }
    }

   
    handleDelete = () => {
        let state = this.state.running
        this.setState({ running: !state })
    }

    deleteProfile = () => {
        let { contract, handleChange, accountId, member, history } = this.props
        let profileId = history.location.pathname.slice(8)
        this.handleDelete()
        if (member === accountId) {
        deleteAppRecord(profileId, 'Profile')
        deleteRecord(profileId, 'Profile')
        contract.deleteProfile({
            profileId: profileId
        }, process.env.DEFAULT_GAS_VALUE).then(response => {
            console.log("[profile.js] profiles", response.len)
            console.log('response', response)
            let newProfiles = response.profiles
            handleChange({ name: "profiles", value: newProfiles })
            this.handleDelete()
        }).catch(err => {
            console.log(err);
        })
        }
    }

    render() { 

        let { profileId, firstName, lastName, avatar, profilePrivacy, member, handleChange, handleDateChange } = this.props

      
    return (
        <Container className="main">
        <div className="profile">
        {member===accountId ?<Icon name='delete' onClick={this.deleteProfile} className="deleteicon" /> : ''}
       
        <Header size='huge'>{member}</Header>
        <Header.Subheader color='teal'>Member Since:  </Header.Subheader>
      
        <Segment secondary className="profileInfo">
        {firstName}
        {lastName}
        {avatar}
        {profilePrivacy}
        
       
       
      
        
        </Segment>
       
        </div>
       
        </Container>
    )
    }
}

export default ProfileData