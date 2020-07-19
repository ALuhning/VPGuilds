import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer, Segment, Header, Divider, Label, Grid } from 'semantic-ui-react'
import { retrieveAppRecord, deleteAppRecord } from '../../../utils/ThreadDB'

import './newsCard.css'

class NewsCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            record: {},
            newsPostPhoto: '',
            title: '',
            postDate: '',
            author: '',
            category: '',
            body: '',
            id: '',
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
                    title: result.title,
                    postDate: result.postDate,
                    id: result._id,
                    author: result.author,
                    category: result.category,
                    body: result.body,
                    published: result.published
                })
            }
        })
    }

    async loadData() {
     let record = await retrieveAppRecord(this.props.newsPostId, 'NewsPost')
     console.log('news card record', record)
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

    deleteNewsPost = () => {
        let { contract, handleChange, accountId } = this.props
        this.handleDelete()
        if (this.state.author === accountId) {
        deleteAppRecord(this.state.id, 'NewsPost') 
        contract.deleteNewsPostsProfile({
            tokenId: this.state.id
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
        let { newsPosts, newsPostId } = this.props
        
        let { id, title, body, postDate, category, author, newsPostPhoto } = this.state
      
        console.log('newsPost props', this.props)
        
       
        // Format jump date as string with date and time for display
        if(postDate) {
        let intDate = parseInt(postDate)
        let formatNewsPostDate = new Date(intDate).toLocaleString()
        console.log("formatted post date", formatNewsPostDate)
        } else {
           let formatNewsPostDate = '12/12/2020'
        }
        let formatSrc = newsPostPhoto
       
            let info = this.state.loaded 
            ? ( 
                <div className="post">
                <Header size='huge' as={Link} to={{pathname: "/@"+id}}>{title}</Header>
                <Header.Subheader color='teal'>Posted: 12/20/2020 </Header.Subheader>
              
                <Segment secondary className="postInfo">
                
               
                <Label as='a'><Image avatar spaced='right' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />{author}</Label>
    
              
                <Label as='a' tag color="blue" className="category"> Test Cat {category} </Label>
              
                
                </Segment>
                <Segment basic>
                <div dangerouslySetInnerHTML={{ __html: body}}>
                </div>
                </Segment>
               
                
                <span className="badgeposition"><Image size='tiny' src={require('../../../../assets/vpguild-logo.png')} avatar />{newsPostId}</span>
                    <Image src={formatSrc} size='small' />
                    
                
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
                {info}
            </Card.Group>
         
        )
    }
}

export default NewsCard