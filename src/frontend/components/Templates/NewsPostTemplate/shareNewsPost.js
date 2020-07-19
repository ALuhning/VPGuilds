import React from 'react';
import { Container, Segment } from 'semantic-ui-react';

export const ShareNewsPost = ({ newsPostDate, newsPostTitle }) => {
    return (
        <Container>
                <Segment>
                {newsPostDate}
                {newsPostTitle}
                </Segment>    
        </Container>
    )
}