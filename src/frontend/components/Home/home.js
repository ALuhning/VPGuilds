import React, { Component } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import Poster from './poster/poster'
import NewsList from '../News/NewsList/newsList'

import './home.css';
class Home extends Component {
    render() {
        let { login, loaded, newsPosts, accountId, userdb, appdb} = this.props
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