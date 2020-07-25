import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react'

//import Header from '../../component/Header/Header';
import Footer from '../../components/Footer/footer';
import Home from '../../components/Home/home';
//import Log from '../../component/Log/log';
//import Account from '../../component/Account/account';
//import Profile from '../../component/Profile/profile';
//import Single from '../../component/Single/single';
//import Animation from '../../component/Log/animation/animation';
//import SocialShare from '../../component/SocialShare/SocialShare';
//import ShowPage from '../../component/showpage/showpage';
import HeaderNav from '../../components/Header/header';
import News from '../../components/News/news'
import Posting from '../../components/News/Posting/posting'
import Commenting from '../../components/common/CommentSubmit/commenting'
import Profiling from '../../components/Account/Profile/profiling'
import Admin from '../../components/Admin/admin'
import Members from '../../components/Members/members'
import SingleNewsPost from '../../components/News/SingleNewsPost/singleNewsPost'
import UserPublishedNewsList from '../../components/Account/PublishedPosts/userPublishedNewsList'
import UserDraftNewsList from '../../components/Account/DraftPosts/userDraftNewsList'
import Profile from '../../components/Account/Profile/profile'
import EditProfile from '../../components/Account/Profile/editProfile'


import './app.css';
import members from '../../components/Members/members';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            loggedIn: false,
            backDrop: false,
            back: false,
            accountId: '',

            // News Posts
            newsPostId: '',
            newsPostDate: new Date().getTime(),
            newsPostCategory: '',
            newsPostBody: '',
            newsPostPhotos: [],
            newsPostAuthor: '',
            newsPostTitle: '',
            newsVerificationHash: '',
            newsPosts: [],
            published: false,

            // Comments
            comments: [],
            commentId: '',
            commentParent: '',
            commentDate: new Date().getTime(),
            commentBody: '',
            commentPhotos: [],
            commentAuthor: '',
            commentVerificationHash: '',
            commentPublished: false,

            // Profiles
            profiles: [],
            profileId: '',
            profilePrivacy: true,
            firstName: '',
            lastName: '',
            avatar: [],
            profileVerificationHash: '',

            // Consolidation Pages
            allNewsPosts: [],

            // Admin
            user: '',
            role: '',
            roles: [],
            members: [],
        }
        this.signedInFlow = this.signedInFlow.bind(this);
        this.requestSignIn = this.requestSignIn.bind(this);
    }

    componentDidMount() {
        let loggedIn = this.props.wallet.isSignedIn()
        this.setState({
            loggedIn: true
        })
        if (loggedIn) {
            this.signedInFlow();
        } else {
            this.signedOutFlow();
        }
    }

    signedOutFlow = () => {
        this.setState({
            loggedIn: false,
            loaded: true,
        });
        window.localStorage.removeItem('enc_key:'+this.state.accountId+':'+'member')
        window.localStorage.removeItem('enc_key:'+process.env.APPID+':'+'org')
        window.localStorage.removeItem(process.env.APPID + ":" + process.env.THREADDB_IDENTITY_STRING)
        window.localStorage.removeItem(process.env.APPID + ":" + process.env.THREADDB_USER_THREADID)
        window.localStorage.removeItem(process.env.APPID + ":" + process.env.THREADDB_TOKEN_STRING)
        return <Redirect to="/" />
    }

    async signedInFlow() {
        const accountId = await this.props.wallet.getAccountId();
        this.setState({
            accountId: accountId
        })

        // fill news posts array
        this.getAllNewsPostsByAllAuthors().then(res => {
            console.log('news res', res);
            this.setState({
                newsPosts: res.newsPosts
            });

            if (res == null ) {
                this.setState({
                    loaded: true
                });
            } else {
                this.setState({
                    newsPosts: res.newsPosts,
                    loaded: true
                });
            }
        }).catch(err => {
            console.log(err);
        })

        // fill comments array
        this.getAllCommentsByAllAuthors().then(res => {
            console.log('comment res', res);
            this.setState({
                comments: res.comments
            });

            if (res == null ) {
                this.setState({
                    loaded: true
                });
            } else {
                this.setState({
                    comments: res.comments,
                    loaded: true
                });
            }
        }).catch(err => {
            console.log(err);
        })

        // fill members array
        this.getAllMembers().then(res => {
            console.log('member res', res);
            this.setState({
                members: res.members
            });

            if (res == null) {
                this.setState({
                    loaded: true
                });
            } else {
                this.setState({
                    members: res.members,
                    loaded: true
                });
            }
        }).catch(err => {
            console.log(err);
        })

        // fill profiles array
        this.getAllProfiles().then(res => {
            console.log('profile res', res);
            this.setState({
                profiles: res.profiles
            });

            if (res == null) {
                this.setState({
                    loaded: true
                });
            } else {
                this.setState({
                    profiles: res.profiles,
                    loaded: true
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    getNewsPostsByAuthor = (author) => {
        return this.props.contract.getNewsPosts({ author: author });
    }

    getAllNewsPostsByAllAuthors = () => {
        return this.props.contract.getAllNewsPosts();
    }

    getAllCommentsByAllAuthors = () => {
        return this.props.contract.getAllComments();
    }
    
    getAllMembers = () => {
        return this.props.contract.getAllMembers();
    }

    getAllProfiles = () => {
        return this.props.contract.getAllProfiles();
    }

    async requestSignIn() {
        await this.props.wallet.requestSignIn(
            process.env.CONTRACT_NAME,
            process.env.APP_TITLE
        )
    }

    requestSignOut = () => {
        this.setState({ loaded: false })
        this.props.wallet.signOut();
        setTimeout(this.signedOutFlow, 2000);
    }

    handleChange = ({ name, value }) => {
        this.setState({
            [name]: value
        })
    }

    handleDateChange = ({ name, value }) => {
        this.setState({
            [name]: value
        })
    }

    backdropCancelHandler = () => {
        this.setState({ backDrop: false })
    }

    backShowHandler = () => {
        this.setState({ back: true })
    }

    backCancelHandler = () => {
        this.setState({ back: false })
    }

    render() {
        let { loggedIn, loaded, backDrop, back, accountId, user, role, roles,
        newsPostId, newsPostAuthor, newsPostBody, newsPostCategory, newsPostTitle, newsPostPhotos, 
        newsVerificationHash, published, newsPostDate, newsPosts, members,
        profiles, profilePrivacy, profileId,
        firstName, lastName, avatar, profileVerificationHash,
        commentId, commentParent, commentPublished, commentVerificationHash, comments } = this.state

        let { contract, account } = this.props
       
        console.log('logged in', loggedIn)
        return (
           <Grid>
                <HeaderNav
                    login={loggedIn}
                    loaded={loaded}
                    requestSignIn={this.requestSignIn}
                    requestSignOut={this.requestSignOut}
                    accountId={accountId}
                    handleChange={this.handleChange} 
                    account={account} 
                />

                <Switch>
                    <Route
                    exact
                    path='/'
                    render={() => 
                        <Home
                            login={loggedIn}
                            loaded={loaded}
                            newsPosts={newsPosts}
                            accountId={accountId}
                        />
                    }
                    />

                    <Route
                    exact
                    path='/user-published-posts'
                    render={() => 
                        <UserPublishedNewsList
                            login={loggedIn}
                            loaded={loaded}
                            newsPosts={newsPosts}
                            accountId={accountId}

                        />
                    }
                    />

                    <Route
                    exact
                    path='/user-draft-posts'
                    render={() => 
                        <UserDraftNewsList
                            login={loggedIn}
                            loaded={loaded}
                            newsPosts={newsPosts}
                            accountId={accountId}

                        />
                    }
                    />

                    <Route
                    exact
                    path='/submit-news'
                    render={() => 
                        <News
                            login={loggedIn}
                            loaded={loaded}
                            accountId={accountId}
                            handleChange={this.handleChange}
                            handleDateChange={this.handleDateChange}
                            newsPostId={newsPostId}
                            newsPostCategory={newsPostCategory}
                            newsPostAuthor={newsPostAuthor}
                            newsPostDate={newsPostDate}
                            newsPostBody={newsPostBody}
                            newsPostPhotos={newsPostPhotos}
                            newsPostTitle={newsPostTitle}
                            newsVerificationHash={newsVerificationHash}
                        />
                    }
                    />

                    <Route
                    exact
                    path='/edit-profile'
                    render={() => 
                        <EditProfile
                            login={loggedIn}
                            loaded={loaded}
                            accountId={accountId}
                            handleChange={this.handleChange}
                            handleDateChange={this.handleDateChange}
                            profileId={profileId}
                            firstName={firstName}
                            lastName={lastName}
                            avatar={avatar}
                            profilePrivacy={profilePrivacy}
                            profileVerificationHash={profileVerificationHash}
                        />
                    }
                    />

                    <Route
                    exact
                    path='/posting'
                    render={() => 
                        <Posting
                            login={loggedIn}
                            loaded={loaded}
                            accountId={accountId}
                            handleChange={this.handleChange}
                            handleDateChange={this.handleDateChange}
                            contract={contract}
                            newsPostId={newsPostId}
                            newsPostTitle={newsPostTitle}
                            newsVerificationHash={newsVerificationHash}
                            published={published}
                            newsPosts={newsPosts}
                        />
                    }
                    />

                    <Route
                    exact
                    path='/commenting'
                    render={() => 
                        <Commenting
                            login={loggedIn}
                            loaded={loaded}
                            accountId={accountId}
                            handleChange={this.handleChange}
                            handleDateChange={this.handleDateChange}
                            contract={contract}
                            commentId={commentId}
                            commentParent={commentParent}
                            commentVerificationHash={commentVerificationHash}
                            commentPublished={commentPublished}
                            comments={comments}
                        />
                    }
                    />

                    <Route
                    exact
                    path='/profiling'
                    render={() => 
                        <Profiling
                            login={loggedIn}
                            loaded={loaded}
                            accountId={accountId}
                            handleChange={this.handleChange}
                            handleDateChange={this.handleDateChange}
                            contract={contract}
                            profileId={profileId}
                            profilePrivacy={profilePrivacy}
                            profiles={profiles}
                            profileVerificationHash={profileVerificationHash}
                        />
                    }
                    />

                    <Route
                        exact
                        path='/@:topicId'
                        
                        render={() => 
                            <SingleNewsPost
                                loaded={loaded}
                                login={loggedIn}
                                contract={contract}
                                newsPosts={newsPosts}
                                newsPostTitle={newsPostTitle}
                                newsPostId={newsPostId}
                                backDrop={backDrop}
                                back={back}
                                backdropCancelHandler={this.backdropCancelHandler}
                                backShowHandler={this.backShowHandler}
                                backCancelHandler={this.backCancelHandler}
                                handleChange={this.handleChange}
                                handleDateChange={this.handleDateChange}
                                accountId={accountId}
                                comments={comments}
                            />
                        }
                    />

                    <Route
                        exact
                        path='/member-:topicId'
                        
                        render={() => 
                            <Profile
                                loaded={loaded}
                                login={loggedIn}
                                contract={contract}
                                profiles={profiles}
                                firstName={firstName}
                                lastName={lastName}
                                avatar={avatar}
                                backDrop={backDrop}
                                back={back}
                                backdropCancelHandler={this.backdropCancelHandler}
                                backShowHandler={this.backShowHandler}
                                backCancelHandler={this.backCancelHandler}
                                handleChange={this.handleChange}
                                handleDateChange={this.handleDateChange}
                                accountId={accountId}
                            />
                        }
                    />

                    <Route
                    exact
                    path='/admin'
                    render={() => 
                        <Admin
                            login={loggedIn}
                            loaded={loaded}
                            user={user}
                            role={role}
                            handleChange={this.handleChange}
                            contract={contract}
                            roles={roles}
                        />
                    }
                    />

                    <Route
                    exact
                    path='/members'
                    render={() => 
                        <Members
                            login={loggedIn}
                            loaded={loaded}
                            user={user}
                            role={role}
                            handleChange={this.handleChange}
                            contract={contract}
                            roles={roles}
                            members={members}
                        />
                    }
                    />

                </Switch>
                <Footer />
            </Grid>
        )
    }
}

export default withRouter(App)