import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Container, Segment, Header, Label, Image, Icon, Form, Button } from 'semantic-ui-react';
import { deleteAppRecord, deleteRecord } from '../../../utils/ThreadDB'
import CommentSubmitForm from '../../common/CommentSubmit/commentSubmit'
import Comment from '../Comments/comment'
import Avatar from '../../common/Avatar/avatar'

import './fullNewsPost.css'

class FullNewsPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            running: false,
            deleted: false
        }
    }
    
   
    componentDidMount() {
        this.loadData()
        .then((result) => {
            this.setState({
                loaded: true
            })
        })
    }

    async loadData() {
    }

    componentWillUnmount() {}

    handleDeleteStart = () => {
        let stateRunning = this.state.running
        this.setState({ 
            running: !stateRunning
        })
    }

    handleDeleteFinish = () => {
        let stateRunning = this.state.running
        this.setState({ 
            running: !stateRunning,
            deleted: true
        })
    }

    deleteNewsPost = async () => {
        let { contract, handleChange, accountId, author, history } = this.props
        let newsPostId = history.location.pathname.slice(2)
        this.handleDeleteStart()
        if (author === accountId) {
        await deleteAppRecord(newsPostId, 'NewsPost')
        await deleteRecord(newsPostId, 'NewsPost')
        await contract.deleteNewsPostProfile({
            tokenId: newsPostId
        }, process.env.DEFAULT_GAS_VALUE).then(async (response) => {
            console.log("[profile.js] posts", response.length)
            console.log('response', response)
            let result = await contract.getAllNewsPosts();
            if (result.length != 0) {
                handleChange({ name: "newsPosts", value: result })
            }
            this.handleDeleteFinish()
        }).catch(err => {
            console.log(err);
        })
        }
    }

    async handlePostDeletion(e) {
        e.preventDefault();
       console.log('e hre', e)
       console.log('handle post deletion props', this.props)
       
       let newsPostId = this.props.history.location.pathname.slice(2)
      
       
            this.props.handleChange({ name: 'newsPostId', value: newsPostId})
            console.log("delete newspostid" , this.state.newsPostId)
           
            this.props.history.push("/deleting")
    }

    render() { 

        
        let { newsPostDate, newsPostTitle, newsPostId, newsPostBody, author, category, comments, published, handleChange, handleDateChange, accountId, thisMember, profileId, profiles, 
        history} = this.props
       console.log('fullnewspost props', this.props)

        let authorProfileId = profiles.filter(function (e) {
            console.log('e', e);
            return e[1] == author;
        })[0]
        console.log('full news authorprofileid', authorProfileId)
        

        // Format post date as string with date and time for display
        let formatNewsPostDate
        if(newsPostDate) {
            let intDate = parseInt(newsPostDate)
            formatNewsPostDate = new Date(intDate).toLocaleString()
            console.log("formatted post date", formatNewsPostDate)
        } else {
            formatNewsPostDate = 'undefined'
        }

        console.log('comments', comments)
        let Comments;
        if(published) {
        Comments = (<Segment>Be the first to comment</Segment>)
       // if (comments && comments.length === 0) { return <Redirect to="/" /> }
        
        if (comments && comments.length > 0) {
            Comments = comments.map(comment => {
               console.log('comments map', comment)
               console.log('comment0', comment[0])
               console.log('comment1', comment[1])
               console.log('comment2', comment[2])
               console.log('comment3', comment[3])
               console.log('comment4', comment[4])
               console.log('newspostId', newsPostId)
               if((comment[0] !='' || comment.commentId !='') && (comment[1] == newsPostId || comment.commentParent == newsPostId) && (comment[4] === 'true' || comment.published === 'true')) {
                return (
                   
                    <Segment key={comment[0]?comment[0]:comment.commentId}>
                        <Comment
                            
                            commentId={comment[0]?comment[0]:comment.commentId}
                            contract={contract}
                            comments={comments}
                            commentAuthor={comment[2]?comment[2]:comment.author}
                            handleChange={handleChange}
                            accountId={accountId}
                            profiles={profiles}
                        />
                    </Segment>
                
                    )
               }
            })
        }  
        } else {
            Comments = <div></div>
        }  
    return (
        <Container className="main">
        <div className="post">
        {author===accountId ?  <Form onSubmit={(e) => this.handlePostDeletion(e)}> <Form.Button
        className="submitButton"
        content='Delete'
    /></Form> : ''}
       
        <Header size='huge'>{newsPostTitle}</Header>
        <Header.Subheader color='teal'>{formatNewsPostDate} </Header.Subheader>
      
        <Segment secondary className="postInfo">
        
       
        <Avatar profileId={authorProfileId?authorProfileId[0]:0} accountId={accountId} />{author}

      
        <Label as='a' tag color="blue" className="category"> Test Cat {category} </Label>
      
        
        </Segment>
        <Segment basic>
        <div dangerouslySetInnerHTML={{ __html: newsPostBody}}>
        </div>
        </Segment>
        </div>
        
        {Comments}
        
       {published ? <Segment>
            <CommentSubmitForm 
                handleChange={handleChange}
                handleDateChange={handleDateChange}
                accountId={accountId}
            />
        </Segment>
        : ''}
        </Container>
    )
    }
}

export default withRouter(FullNewsPost)