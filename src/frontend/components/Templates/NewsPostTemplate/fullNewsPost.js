import React, { Component } from 'react';
import { Container, Segment, Header, Label, Image, Icon } from 'semantic-ui-react';
import { deleteAppRecord } from '../../../utils/ThreadDB'

class FullNewsPost extends Component {
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

    deleteNewsPost = () => {
        let { contract, handleChange, accountId, author, history } = this.props
        let newsPostId = history.location.pathname.slice(2)
        this.handleDelete()
        if (author === accountId) {
        deleteAppRecord(newsPostId, 'NewsPost') 
        contract.deleteNewsPostProfile({
            tokenId: newsPostId
        }, process.env.DEFAULT_GAS_VALUE).then(response => {
            console.log("[profile.js] posts", response.len)
            console.log('response', response)
            let newPosts = response.newsPosts
            handleChange({ name: "newsPosts", value: newPosts })
            this.handleDelete()
        }).catch(err => {
            console.log(err);
        })
        }
    }

    render() { 

        let { newsPostDate, newsPostTitle, newsPostId, newsPostBody, author, category } = this.props
   
   
    return (
        <Container className="main">
        <div className="post">
        <Icon name='delete' onClick={this.deleteNewsPost} />
        <Header size='huge'>{newsPostTitle}</Header>
        <Header.Subheader color='teal'>Posted: {newsPostDate} </Header.Subheader>
      
        <Segment secondary className="postInfo">
        
       
        <Label as='a'><Image avatar spaced='right' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />{author}</Label>

      
        <Label as='a' tag color="blue" className="category"> Test Cat {category} </Label>
      
        
        </Segment>
        <Segment basic>
        <div dangerouslySetInnerHTML={{ __html: newsPostBody}}>
        </div>
        </Segment>
       
        
        <span className="badgeposition"><Image size='tiny' src={require('../../../../assets/vpguild-logo.png')} avatar />{newsPostId}</span>
          
            
        
        </div>
              
        </Container>
    )
    }
}

export default FullNewsPost