import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import  FullNewsPost from '../../Templates/NewsPostTemplate/fullNewsPost';
import  Share from '../../Share/share';
import { SendAndShare } from '../../Share/sendAndShare';
import Spinners from '../../common/Spinner/spinner';
import { Container, Segment } from 'semantic-ui-react';
import { retrieveAppRecord, retrieveRecord } from '../../../utils/ThreadDB'

import "./singleNewsPost.css"

class SingleNewsPost extends Component {
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
            published: false,
        }
    }

    componentDidMount() {
        this.loadData()
        .then((result) => {
            console.log('result', result)
            if(result) {
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
        let newsPostId = this.props.history.location.pathname.slice(2)
        console.log('newspostid', newsPostId)
        console.log('news posts here and ', this.props.newsPosts)
        let record = await retrieveAppRecord(newsPostId, 'NewsPost')
        if(!record) {
            record = await retrieveRecord(newsPostId, 'NewsPost')
        }
        console.log('post record', record)
        if(record !== undefined) {
            return record
        } else {
            console.log('no record')
           
        }    
    }

    render() {
        let {
            newsPosts,
            login,
            loaded,
            back,
            backShowHandler,
            backCancelHandler,
            accountId,
            history,
            contract,
            handleChange,
            handleDateChange,
            comments,
            thisMember,
            profileId,
            profiles,
            authorProfileId
        } = this.props

        let { id, title, body, postDate, category, author, published, newsPostPhoto } = this.state

        if (!loaded) { return <Container className='main'><Spinners /></Container> }
        if (loaded && !login) { return <Redirect to="/" /> }
        if (!newsPosts) { return <Redirect to="/submit-news" /> }
        
        return (
            <Container>                
                    <FullNewsPost
                        newsPostDate={postDate}
                        newsPostTitle={title}
                        newsPostBody={body}
                        newsPostId={id}
                        author={author}
                        category={category}
                        accountId={accountId}
                        history={history}
                        contract={contract}
                        handleChange={handleChange}
                        handleDateChange={handleDateChange}
                        comments={comments}
                        published={published}
                        thisMember={thisMember}
                        profileId={profileId}
                        profiles={profiles}
                        
                    />
                        
                    <Segment>
                        <Share
                            newsPostTitle={title}
                            newsPostDate={postDate}
                            backCancelHandler={backCancelHandler}
                            back={back}
                            newsPostId={id}
                        />
                        <SendAndShare backShowHandler={backShowHandler} />
                    </Segment>
                
            </Container>
        )
        
    }

}

export default withRouter(SingleNewsPost)