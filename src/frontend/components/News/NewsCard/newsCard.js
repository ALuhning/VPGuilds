import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer, Segment, Header, Divider, Label, Grid } from 'semantic-ui-react'
import { retrieveAppRecord, deleteAppRecord, deleteRecord } from '../../../utils/ThreadDB'
import Avatar from '../../common/Avatar/avatar'

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
            if(result && result.published === true) {
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
        console.log('is there an id', this.props.newsPostId)
     let record = await retrieveAppRecord(this.props.newsPostId, 'NewsPost')
     console.log('news card record', record)
     if(record) {
        return record
     } else {
     console.log('no record')
     }
    }


    render() {
        let { newsPosts, newsPostId, profiles, accountId } = this.props
        let { id, title, body, postDate, category, author, newsPostPhoto } = this.state
        console.log('news card profiles', profiles)
        console.log('news card author', author)

        let authorProfileId = profiles.filter(function (e) {
            console.log('e', e);
            return e[1] == author;
        })[0]
        console.log('news card authorprofileid', authorProfileId)
      
        console.log('newsPost props', this.props)
        
       
         // Format post date as string with date and time for display
         let formatNewsPostDate
         console.log('card news post date', postDate)
         if(postDate) {
             let intDate = parseInt(postDate)
             formatNewsPostDate = new Date(intDate).toLocaleString()
             console.log("formatted post date", formatNewsPostDate)
         } else {
             formatNewsPostDate = 'undefined'
         }


        let info;
       if (this.state.loaded) {
           info = ( 
            <div className="post">
            <Header size='huge' as={Link} to={{pathname: "/@"+id}}>{title}</Header>
            <Header.Subheader color='teal'>Posted: {formatNewsPostDate} </Header.Subheader>
          
            <Segment secondary className="postInfo">
            
           
            <Avatar profileId={authorProfileId?authorProfileId[0]:0} accountId={accountId} />{author}

          
            <Label as='a' tag color="blue" className="category"> Test Cat {category} </Label>
          
            
            </Segment>
            <Segment basic>
            <div dangerouslySetInnerHTML={{ __html: body}}>
            </div>
            </Segment>
                
            
            </div>
        )
       } else {
            if (id) {
                info = (
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
            } else {
               info = <div></div>
           }
       }
           
        return (
            <Card.Group>
                {info}
            </Card.Group>
         
        )
    }
}

export default NewsCard