import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Container, Header, Card, Segment } from 'semantic-ui-react';
import NewsCard from '../NewsCard/newsCard';

import './newsList.css';

class NewsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            running: true,
            loaded: false
           
        };
    }

    componentDidMount() {
        this.loadData().then((res) => {
            console.log('newslist res', res)
            this.props.handleChange({ name: "newsPosts", value: res.newsPosts})
            this.setState({
                loaded: true
            })
            
        })
    }

    async loadData() {
        return this.props.contract.getAllNewsPosts();
    }

    render() {
        let { newsPosts, login, handleChange, contract, accountId, profiles } = this.props
        let { loaded } = this.state
       
        if (loaded === false) {
            return <div>Loading...</div>
        } else {

        console.log('newsposts list members ', newsPosts)
        if (loaded && !login ) {return <Redirect to="/" />}
        let Posts;
        
        if (loaded && (!newsPosts || newsPosts.length === 0)) { 
            Posts = 'no news yet'
        }

        if (loaded && newsPosts.length > 0) {
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