import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { GrTwitter, GrFacebook } from 'react-icons/gr';

import { CreationSingle } from '../creation/creationSingle/creationSingle';
import SharePage from '../Share/share';
import Spinners from '../common/spinner/spinner';

import "./single.css"
class SingleNewsPost extends Component {
    render() {
        let {
            newsPosts,
            login,
            load,
            history,
            back,
            backShowHandler,
            backCancelHandler
        } = this.props
        if (!load) { return <Spinners /> }
        if (load && !login) { return <Redirect to="/" /> }
        let newsPostId = history.location.hash.slice(1)
        let newsPostTitle = history.location.pathname.slice(2)
        let newsPost = newsPosts.filter((post) => post.newsPostId === newsPostId && post.newsPostTitle === newsPostTitle)[0]
        if (!newsPost) { return <Redirect to="/account" /> }

        let Post = <CreationSingle
                newsPostDate={newsPost.newsPostDate}
                />
        return (
            <div>
                <SharePage
                    newsPostTitle={newsPost.newsPostTitle}
                    newsPostDate={newsPost.newsPostDate}
                    backCancelHandler={backCancelHandler}
                    back={back}
                    newsPostId={newsPost.newsPostId}/>
                <div>
                    <h2>Checkout {newsPost.newsPostTitle}!</h2>
                    <div>
                        {Post}
                    </div>
                    <div>
                        <SendAndShare backShowHandler={backShowHandler} />
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(SingleNewsPost)



const SendAndShare = ({ backShowHandler }) => {
    let style = { display: "flex", flexDirection: "column", margin: "auto" }
    return (
        <div>
          
            <span style={style}>
                <Share clicked={backShowHandler} />
            </span>
        </div>
    )
}

const Share = ({ clicked }) => {
    let share = (
            <div>
                <p className="text">Nice Post - share the knowledge:</p>
                <span className="share-icons"><GrTwitter className="flaticon" /><GrFacebook className="flaticon" /></span>
            </div>
       )
    return (
        <button className="sharecard" onClick={clicked}>
            {share}
        </button>
    )
}