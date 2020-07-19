import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Message, Icon } from 'semantic-ui-react';
import NewsSubmitForm from './NewsSubmitForm/newsSubmitForm'
import './news.css'


export const AlertDismissible = ({ show }) => {
    if (show) {
        return (
            <Message warning icon>
            <Icon name='warning sign' />
            <Message.Content>
                <Message.Header>
                We are currently in development
                </Message.Header>
                Play around - but you'll have to start over when we launch. Stay tuned for the announcement.
            </Message.Content>
            </Message>
        );
    }
}

class News extends Component {

    componentDidMount() {
      
     
    }

    render() {

        let { login, loaded, handleChange, handleDateChange, accountId, newsPostId, newsVerificationHash,
            newsPostAuthor, newsPostTitle, newsPostDate,
            newsPostCategory, newsPostBody, newsPostPhotos } = this.props

        if (loaded && !login) {return <Redirect to="/" />}

        return (
            <Container className="main">
            <AlertDismissible show={true} />
              
                <h2 className="head">Create News Post</h2>
               
                    <NewsSubmitForm  
                        handleChange={handleChange} 
                        handleDateChange={handleDateChange}
                        accountId={accountId}
                        newsPostId={newsPostId}
                        newsVerificationHash={newsVerificationHash}
                        newsPostTitle={newsPostTitle}
                        newsPostDate={newsPostDate}
                        newsPostAuthor={newsPostAuthor}
                        newsPostCategory={newsPostCategory}
                        newsPostBody={newsPostBody}
                        newsPostPhotos={newsPostPhotos}
                    />
              
          
            </Container>
           
        )
    }
}

export default News