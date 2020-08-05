import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer, Grid, Button } from 'semantic-ui-react'
import Avatar from '../../../components/common/Avatar/avatar'
import { retrieveRecord, deleteRecord, initiateCollection } from '../../../utils/ThreadDB'
import * as nearlib from "near-api-js";
const BN = require('bn.js')

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
            profilePhoto: '',
            accessKey: ''
        }
    }
   
    componentDidMount() {
        this.loadData()
        .then((result) => {
            console.log('result', result)
            //let keyPair = nearlib.KeyPair.fromString(result.public_key)
            //console.log('keypair', keyPair)
            
         //   let user_account_privateKey = window.localStorage.getItem(`near-api-js:keystore:${this.props.memberAccount}:default`)
         //   window.walletConnection._keyStore.setKey('default', this.props.memberAccount, user_account_privateKey)
           
            this.setState({loaded:true})
            this.setState({
                memberAccount: this.props.memberAccount,
                accessKey: result
            })
        })
        console.log('state accesskey', this.state.accessKey)
        console.log('state memberAccount', this.state.memberAccount)
    }

    async loadData() {
        console.log('near', this.props.near)
        console.log('nearlib', nearlib)
      //  const fullPublicKey = window.walletConnection._authData.allKeys[0]
      //  const keyPathStore = new nearlib.InMemorySigner();
      //  let key = await keyPathStore.createKey(this.props.memberAccount, 'default')
      //  console.log('new key', key)
      //  console.log('keyPathStore1', keyPathStore)
       // await nearlib.KeyStore.setKey('default', accountId, fullPublicKey);
       // console.log('keyPathStore2', keyPathStore)
        //const key = await keyPathStore.getKey('default', accountId)
        //const publicKey = key.getPublicKey()
        //console.log('public key', publicKey.toString())
        //console.log( 'key', key)
      //  console.log('wallet', this.props.wallet)
      //  console.log('wallet signed in', this.props.wallet.isSignedIn())
        const account = window.walletConnection.account()
      //  console.log('this account', account)
        const accessKeys = await account.getAccessKeys();
      //  console.log('accessKeys', accessKeys)
        const walletKeys = window.walletConnection._authData.allKeys;
      //  console.log('walletkeys', walletKeys)
     // let full = nearlib.transactions.fullAccessKey()
     // console.log('full', full)
     //let fullAccount = await nearlib.transactions.addKey(result.public_key, full)
     // nearlib.KeyStore.setKey('default', this.props.memberAccount, full);
        let receiverId = 'guildleader.testnet'
        let actions=['Transfer']
        for (const accessKey of accessKeys) {
            if (walletKeys.indexOf(accessKey.public_key) !== -1 && await window.walletConnection._connectedAccount.accessKeyMatchesTransaction(accessKey, receiverId, actions)) {
                return accessKey;
            }
        }
        
       // console.log('near signer', this.props.near.connection.signer)
       // let localKey =  await this.props.near.connection.signer.getPublicKey(this.props.memberAccount, this.props.near.connection.networkId)
       // console.log('localkey', localKey.toString())
       // const fullPublicKey = window.walletConnection._authData.allKeys[0]
       // console.log('authkey', window.walletConnection._authData.allKeys[0])
      //  let sender = await this.props.near.account('vitalpointai.testnet')
      //  console.log('sender', sender)
      // console.log('signer', await sender.sendMoney('guildleader.testnet', 1000))
     //   console.log('window acct', await window.acct.getAccessKeys())
     //   console.log('findaccesskey', await window.acct.findAccessKey(1))
     //   console.log('window acct', window.acct)
     //   console.log('signer id', nearlib.Signer)
     //   console.log('nearlib', nearlib)


        
        
    }

    async sendMoney(to) {
       let amount_to_send = nearlib.utils.format.parseNearAmount('1')
       let sender = await near.account(window.walletConnection.getAccountId())
       let final = await sender.sendMoney(to, amount_to_send)
       console.log('final', final)        
        return final
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