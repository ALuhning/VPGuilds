import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer, Segment, Header, Divider, Label, Grid } from 'semantic-ui-react'
import { retrieveAppRecord, deleteAppRecord } from '../../../utils/ThreadDB'

import './comment.css'

class Comment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            commentPhotos: '',
            commentSubject: '',
            commentDate: '',
            commentAuthor: '',
            commentParent: '',
            commentBody: '',
            commentId: '',
            commentPublished: '',
            running: false
        }
    }
   
    componentDidMount() {
        this.loadData()
        .then((result) => {
            console.log('result', result)
            if(result.published === true) {
                this.setState({
                    loaded:true,
                    commentSubject: result.subject,
                    commentDate: result.postDate,
                    commentId: result._id,
                    commentAuthor: result.author,
                    commentParent: result.parent,
                    commentBody: result.body,
                    commentPublished: result.published,
                })
            }
        })
    }

    async loadData() {
     let record = await retrieveAppRecord(this.props.commentId, 'Comment')
     console.log('comment record', record)
     if(record !== undefined) {
        return record
     } else {
     console.log('no record')
     return record
     }
    }

    handleDelete = () => {
        let state = this.state.running
        this.setState({ running: !state })
    }

    deleteComment = () => {
        let { contract, handleChange, accountId } = this.props
        this.handleDelete()
        if (this.state.commentAuthor === accountId) {
        deleteAppRecord(this.state.commentId, 'Comment') 
        contract.deleteCommentProfile({
            commentId: this.state.commentId
        }, process.env.DEFAULT_GAS_VALUE).then(response => {
            console.log("[comment].js] comments", response.len)
            console.log('response', response)
            let newComments = response.comments
            handleChange({ name: "comments", value: newComments })
            this.handleDelete()
        }).catch(err => {
            console.log(err);
        })
        }
    }


    render() {
               
        let { commentId, commentParent, commentSubject, commentBody, commentDate, commentAuthor } = this.state        
       
        // Format jump date as string with date and time for display
        let formatCommentDate;
        if(commentDate) {
        let intDate = parseInt(commentDate)
        let formatCommentDate = new Date(intDate).toLocaleString()
        console.log("formatted comment date", formatCommentDate)
        } else {
           let formatCommentDate = '12/12/2020'
        }
      
       
            let comment = this.state.loaded 
            ? ( 
                <div className="comment">
                <Header size='small'>{commentSubject}</Header>
                <Header.Subheader color='teal'>Posted: {formatCommentDate}</Header.Subheader>
              
                <Segment secondary className="commentInfo">
                
               
                <Label as='a'><Image avatar spaced='right' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />{commentAuthor}</Label>
    
              
                <Label as='a' tag color="blue" className="category"> Test Cat {commentId} </Label>
              
                
                </Segment>
                <Segment basic>
                <div dangerouslySetInnerHTML={{ __html: commentBody}}>
                </div>
                </Segment>
               
                
                <span className="badgeposition"><Image size='tiny' src={require('../../../../assets/vpguild-logo.png')} avatar />{commentId}</span>
                    
                    
                
                </div>
            )
        :
            (
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
                {comment}
            </Card.Group>
         
        )
    }
}

export default Comment