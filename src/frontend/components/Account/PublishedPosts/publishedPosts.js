import React, { Component } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import UserPublishedNewsList from './userPublishedNewsList'

import './publishedPosts.css';
class PublishedPosts extends Component {
    render() {
        let { login, loaded, newsPosts, accountId} = this.props
        let page = '';
        if (login && loaded) {
            page = (
                <UserPublishedNewsList
                    login={login}
                    loaded={loaded}
                    contract={contract}
                    newsPosts={newsPosts}
                    accountId={accountId}
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