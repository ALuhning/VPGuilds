import React, { Component } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import UserDraftNewsList from './userDraftNewsList'

import './draftPosts.css';
class DraftPosts extends Component {
    render() {
        let { login, loaded, newsPosts, accountId, profiles} = this.props
        let page = '';
        if (login && loaded) {
            page = (
                <UserDraftNewsList
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

export default DraftPosts