import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer, Grid, Button } from 'semantic-ui-react'
import Avatar from '../../../components/common/Avatar/avatar'
import { retrieveRecord, deleteRecord, initiateCollection } from '../../../utils/ThreadDB'

import './memberCard.css'
import { parseEncryptionKeyNear } from '../../../utils/Encryption';
import { Signer } from 'crypto';

class MemberCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            memberId: '',
            memberAccount: '',
            memberName: '',
            memberDateJoined: 0,
            members: [],
            profilePhoto: ''
        }
    }
   
    componentDidMount() {
        this.loadData()
        .then((result) => {
            console.log('result', result)
            this.setState({loaded:true})
            this.setState({
                memberAccount: this.props.accountId
            })
        })
    }

    async loadData() {
        
    }

    async sendMoney(to) {
        
        let final = await acct.sendMoney(to, 1000)
    }

    render() {
        let { members, memberId, memberAccount, memberRole, memberJoinDate } = this.props
        console.log('membercard props', this.props)

        let memberAvatar = members.filter((member) => member[0] === memberId)[0]
        console.log('card avatar', memberAvatar)

        // Format member join date as string with date and time for display
        let intDate = parseInt(memberJoinDate)
        let options = {year: 'numeric', month: 'long', day: 'numeric'}
        let formatMemberJoinDate = new Date(intDate).toLocaleString('en-US', options)
        console.log("format date", formatMemberJoinDate)     
        let formatSrc = this.state.profilePhoto

        let info = this.state.loaded
        ? ( <Card>
            <Grid>
                <Grid.Row className="memberCardRow">
                    <Grid.Column floated='left' width={4}>
                        <span className="badgeposition"><Image size='tiny' src={require('../../../../assets/vpguild-logo.png')} avatar />{memberId}</span>
                    </Grid.Column>
                    <Grid.Column floated='right' width={5}>
                        <span className="avatarposition"><Avatar profileId={memberAvatar[0]} accountId={memberAvatar[1]} /></span>
                    </Grid.Column>
                </Grid.Row>
            </Grid>  
           
                    <Card.Content 
                        header={memberAccount} 
                        as={Link} 
                        to={{ 
                            pathname: "/member-" + memberAccount,
                            hash: memberId
                        }} 
                        className="memberAccount"
                    /> 
                    <Card.Content>
                   
                    <Card.Description>
                    <Button onClick={() => this.sendMoney(memberAvatar[1])}>Send $1</Button>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <span className='date'>Member since: {formatMemberJoinDate}</span>
                </Card.Content>
            </Card> 
        )
        : (
            <Card>
            <Card.Content>
            <Card.Header>
            </Card.Header>
            <Dimmer active>
                <Loader>Loading</Loader>
            </Dimmer>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                22 friends
            </Card.Content>
            </Card>
        )
      
       
        return (
            <Card.Group>
                {info}
            </Card.Group>
         
        )
    }
}

export default MemberCard