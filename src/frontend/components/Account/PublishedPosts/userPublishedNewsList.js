import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import UserPublishedNewsCard from './UserPublishedNewsCard/userPublishedNewsCard';

import './userPublishedNewsList.css';

class UserPublishedNewsList extends Component {
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
               if(post[0]!=='' && post[1] === accountId && post[3]=== 'true') {
                return (
                        
                        <UserPublishedNewsCard
                            key={post[0]}
                            newsPostId={post[0]}
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
                <Header as='h1'>Published News Posts</Header>
                 {Posts}
               </Container>
           
        )
    }
    }
}

export default withRouter(UserPublishedNewsList)