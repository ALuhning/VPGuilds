import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import UserDraftNewsCard from './UserDraftNewsCard/userDraftNewsCard';

import './userDraftNewsList.css';

class UserDraftNewsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            running: true
        };
    }

    componentDidMount() {
        this.loadData().then(() => {
            this.setState({loaded:true})
        })
    }

    async loadData() {
       
    }

    render() {
        let { newsPosts, login, loaded, handleChange, contract, accountId } = this.props
        if (loaded === false) {
            return <div>Loading...</div>
        } else {


       
        console.log('newsposts list members ', newsPosts)
        if (loaded && !login) {return <Redirect to="/" />}
        let Posts = 'loading'
        if (newsPosts && newsPosts.length === 0) { return <Redirect to="/" /> }
        
        if (newsPosts.length > 0) {
            Posts = newsPosts.map(post => {
               console.log('news posts map', post)
               console.log('post[0]', post[0])
               console.log('accountId', accountId)
               console.log('post[1]', post[1])
               if((post[0]!=='' || post.newsPostId!=='') && (post[1] === accountId || post.newsPostAuthor === accountId) && (post[3]=== 'false' || post.published === 'false')) {
                return (
                        
                        <UserDraftNewsCard
                            key={post[0]?post[0]:post.newsPostId}
                            newsPostId={post[0]?post[0]:post.newsPostId}
                            contract={contract}
                            newsPosts={newsPosts}
                            handleChange={handleChange}
                            />
                       
                    )
               }
            })
        }    
    
        return (
                <Container className="main">
                <Header as='h1'>Draft News Posts</Header>
                 {Posts}
               </Container>
           
        )
    }
    }
}

export default withRouter(UserDraftNewsList)