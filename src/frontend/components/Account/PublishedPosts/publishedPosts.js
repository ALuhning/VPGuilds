import React, { Component } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import UserPublishedNewsList from './userPublishedNewsList'

import './publishedPosts.css';
class PublishedPosts extends Component {
    render() {
        let { login, loaded, newsPosts, accountId, profiles} = this.props
        let page = '';
        if (login && loaded) {
            page = (
                <UserPublishedNewsList
                    login={login}
                    loaded={loaded}
                    contract={contract}
                    newsPosts={newsPosts}
                    accountId={accountId}
                    profiles={profiles}
                />
                )
        }
        return (
            <Container className="main">
                
                    {page}
                
            </Container>
        )
    }
}

export default PublishedPosts