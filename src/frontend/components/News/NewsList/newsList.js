import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Container, Header, Card, Segment } from 'semantic-ui-react';
import NewsCard from '../NewsCard/newsCard';

import './newsList.css';

class NewsList extends Component {
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
        let newsPostList = await this.props.contract.getAllNewsPosts();
        console.log('existing news posts', newsPostList)
       
    }

    render() {
        let { newsPosts, login, loaded, handleChange, contract, accountId, profiles } = this.props
        if (loaded === false) {
            return <div>Loading...</div>
        } else {


       
        console.log('newsposts list members ', newsPosts)
        if (loaded && !login) {return <Redirect to="/" />}
        let Posts = 'loading'
        if (newsPosts && newsPosts.length === 0) { 
            Posts = 'no news yet'
        }

        if (newsPosts.length > 0) {
            Posts = newsPosts.map(post => {
               console.log('news posts map', post)
               if((post[0]!='' || post.newsPostId !='') && (post[3] === 'true' || post.published=== 'true')) {
                return (
                        
                        <NewsCard
                            key={post[0]?post[0]:post.newsPostId}
                            newsPostId={post[0]?post[0]:post.newsPostId}
                            contract={contract}
                            newsPosts={newsPosts}
                            handleChange={handleChange}
                            accountId={accountId}
                            profiles={profiles}
                            />
                       
                    )
               }
            })
        }    
    
        return (
                <div>
                    <Header as='h1'>Latest News</Header>
                    {Posts}
                </div>
           
        )
    }
    }
}

export default withRouter(NewsList)