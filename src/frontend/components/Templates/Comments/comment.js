import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer, Segment, Header, Divider, Label, Grid } from 'semantic-ui-react'
import { retrieveAppRecord, deleteAppRecord } from '../../../utils/ThreadDB'
import Avatar from '../../../components/common/Avatar/avatar'

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
        console.log('commentId', this.props.commentId)
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
               
        let { commentId, commentParent, commentSubject, commentBody, commentDate } = this.state
        let { comments, profiles, commentAuthor } = this.props
        console.log('comment Author', commentAuthor)
        console.log('comments', comments)
       
        let commentMember = comments.filter((comment) => ((comment[2] == commentAuthor) || comment.commentAuthor == commentAuthor))[0]
        console.log('commenter', commentMember)

        let authorProfileId = profiles.filter(function (e) {
            console.log('e', e);
            return e[1] == commentAuthor;
        })[0]
        console.log('comment authorprofileid', authorProfileId)


          // Format post date as string with date and time for display
          let formatCommentDate
          console.log('comment post date', commentDate)
          if(commentDate) {
              let intDate = parseInt(commentDate)
              formatCommentDate = new Date(intDate).toLocaleString()
              console.log("formatted comment date", formatCommentDate)
          } else {
              formatCommentDate = 'undefined'
          }
      
       
            let comment = this.state.loaded 
            ? ( 
                <div className="comment">
                    <Header size='small'>{commentSubject}</Header>
                    <Header.Subheader color='teal'>Posted: {formatCommentDate}</Header.Subheader>
                
                    <Segment secondary className="commentInfo">
                        <Avatar profileId={authorProfileId?authorProfileId[0]:0} accountId={commentAuthor}/> {commentAuthor}
                        <Label as='a' tag color="blue" className="category"> Test Cat </Label>
                    </Segment>
                    <Segment basic>
                        <div dangerouslySetInnerHTML={{ __html: commentBody}}>
                        </div>
                    </Segment>
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