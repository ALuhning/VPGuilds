import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Icon, Loader, Dimmer, Segment, Header, Divider, Label, Grid } from 'semantic-ui-react'
import { retrieveRecord, deleteRecord } from '../../../../utils/ThreadDB'
import Avatar from '../../../common/Avatar/avatar'

import './userDraftNewsCard.css'

class UserDraftNewsCard extends Component {
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
            published: ''
        }
    }
   
      componentDidMount() {
        this.loadData()
        .then((result) => {
            console.log('result', result)
            if(result && result.published === false){
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
     let record = await retrieveRecord(this.props.newsPostId, 'NewsPost')
     console.log('news card record', record)
     if(record !== undefined) {
        return record
     } else {
     console.log('no record')
     }
    }


    render() {
        let { newsPosts, newsPostId, profiles, accountId } = this.props
        
        let { id, title, body, postDate, category, author, newsPostPhoto, published, loaded } = this.state
      
        console.log('user published news card state', this.state)
        let authorProfileId = profiles.filter(function (e) {
            console.log('e', e);
            return e[1] == author;
        })[0]
        console.log('news card authorprofileid', authorProfileId)
       
        // Format jump date as string with date and time for display
        if(postDate) {
        let intDate = parseInt(postDate)
        let formatNewsPostDate = new Date(intDate).toLocaleString()
        console.log("formatted post date", formatNewsPostDate)
        } else {
           let formatNewsPostDate = '12/12/2020'
        }
        let formatSrc = newsPostPhoto

       
        let info;
        if(loaded && !published){
            info = ( 
                <div className="post">
              
                <Header size='huge' as={Link} to={{pathname: "/@"+id}}>{title}</Header>
                <Header.Subheader color='teal'>Posted: 12/20/2020 </Header.Subheader>
              
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

export default UserDraftNewsCard