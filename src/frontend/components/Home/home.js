import React, { Component } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import Poster from './poster/poster'
import NewsList from '../News/NewsList/newsList'

import './home.css';
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            running: true,           
        };
    }

    componentDidMount() {
        this.loadData().then(() => {
            console.log('loaded in mount', this.state.loaded)
            this.setState({
                loaded:true
            })
            
        })
    }

    async loadData() {
        
    }

    render() {
        let { login, newsPosts, accountId, userdb, appdb, profiles, handleChange} = this.props
        let { loaded } = this.state
        console.log('login', login)
        console.log('loaded', loaded)
        let page = '';
        if(!login) {
            page = (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>            
                            <Poster />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>    
            )
        } else if (login && loaded) {
            page = (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <NewsList
                                login={login}
                                loaded={loaded}
                                contract={contract}
                                newsPosts={newsPosts}
                                accountId={accountId}
                                userdb={userdb}
                                appdb={appdb}
                                profiles={profiles}
                                handleChange={handleChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <h3>Right Sidebar</h3>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>        
                )
        }
        return (
            <Container className="main">
               {page}            
            </Container>
        )
    }
}

export default Home