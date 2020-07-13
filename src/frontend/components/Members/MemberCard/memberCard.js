import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer } from 'semantic-ui-react'
import { retrieveRecord, deleteRecord, initiateCollection } from '../../../utils/ThreadDB'
//import { memberProfileSchema } from '../../../schemas/MemberProfile'

import './memberCard.css'

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
        
     //   await initiateCollection('MemberProfile', memberProfileSchema)
     //   let record = await retrieveRecord(member.jumpIdentifier, 'MilitaryJump')
     //   console.log('recordfinal', record)
     //   return record
    }

    deleteJump = () => {
        let { contract, jump, handleChange, handleDelete } = this.props
       
        handleDelete()
        deleteRecord(jump.jumpIdentifier, 'MilitaryJump') 
        contract.deleteJumpProfile({
            tokenId: jump.jumpIdentifier
        }, process.env.DEFAULT_GAS_VALUE).then(response => {
            console.log("[profile.js] jumps", response.len)
            let newJumps = response.jumps
            handleChange({ name: "jumps", value: newJumps })
            handleDelete()
        }).catch(err => {
            console.log(err);
        })
    }


    render() {
        let { members, memberId, memberAccount, memberRole, memberJoinDate } = this.props
        console.log('membercard props', this.props)
        // Format jump date as string with date and time for display
        let intDate = parseInt(memberJoinDate)
        let formatMemberJoinDate = new Date(intDate).toLocaleString()
        console.log("format date", formatMemberJoinDate)     
        let formatSrc = this.state.profilePhoto

        let info = this.state.loaded
        ? ( <Card>
            <span className="badgeposition"><Image size='tiny' src={require('../../../../assets/vpguild-logo.png')} avatar />{memberId}</span>
                <Image src={formatSrc} size='small' />
                
           
                    <Card.Content header={memberAccount} as={Link} to={{
                        pathname: "/@" + memberId,
                        hash: memberId
                    }} className="memberAccount"/>
                    <Card.Content>
                    <Card.Meta>
                        <span className='date'>Member since: {formatMemberJoinDate}</span>
                    </Card.Meta>
                    <Card.Description>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                            <Icon name='user' />
                            22 friends
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