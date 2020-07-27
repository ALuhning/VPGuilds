import React, { Component } from 'react';
import { Redirect, Link, browserHistory } from 'react-router-dom';
import { Container, Segment, Header, Label, Image, Icon, Menu } from 'semantic-ui-react';
import { deleteAppRecord, deleteRecord } from '../../../utils/ThreadDB'


import './profileData.css'

class ProfileData extends Component {

    constructor(props) {
        super(props)
        this.state = {
            running: false,
            profileId: '',
            memberAccount: ''
        }
    }

    componentDidMount() {
        this.loadData().then(() => {
            let memberAccount = this.props.history.location.pathname.slice(8)
            let profileId = this.props.history.location.hash.slice(1)
            this.setState({
                profileId: profileId,
                memberAccount: memberAccount
            })
            console.log('state profileId', this.state.profileId)
            console.log('memberaccount', this.state.memberAccount)
           
        })
    }


    async loadData() {
       
    }
   
    handleDelete = () => {
        let state = this.state.running
        this.setState({ running: !state })
    }

    deleteProfile = () => {
        let { contract, handleChange, accountId, member, history } = this.props
        let profileId = history.location.hash.slice(1)
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
            return <Redirect to="/members" />
        }).catch(err => {
            console.log(err);
        })
        }
    }

    render() { 

        const { profileId, firstName, lastName, avatar, profilePrivacy, member, memberAccount, handleChange, handleDateChange, accountId, members, history} = this.props
        console.log('profiledata props', this.props)
        let thisProfileId = history.location.hash.slice(1)
        let thisMember = members.filter((member) => member[0] === thisProfileId)[0]
        console.log('this member', thisMember)

        let intDate = parseInt(thisMember[3])
        let formatMemberJoinDate = new Date(intDate).toLocaleString()
        console.log("format date", formatMemberJoinDate) 
      
    return (
        <Container className="main">
        
            {member===accountId ?<Segment><div><Menu icon><Menu.Item name='delete' onClick={this.deleteProfile}><Icon name='delete'/></Menu.Item>
            <Menu.Item name='edit' as={Link} to={`/edit-profile-${member}#${profileId}`}><Icon name='edit'/></Menu.Item></Menu></div> </Segment>: ''}
       
        <Image src={avatar} size='small' bordered /><Header size='huge'>{thisMember[1]}</Header>
        <Header.Subheader color='teal'>Member Since: {formatMemberJoinDate} </Header.Subheader>
      
        
        {firstName}
        {lastName}
        
      
       
        
       
        </Container>
    )
    }
}

export default ProfileData