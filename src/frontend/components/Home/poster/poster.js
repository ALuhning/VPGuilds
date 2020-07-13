import React, { Component } from 'react';
import { Grid, Segment, Container, Button } from 'semantic-ui-react';
import ImageLoader from '../../common/ImageLoad/ImageLoad'
import VPGuildLogo from '../../../../assets/vpguild-logo.png'

import "./poster.css";

class Poster extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
    }
    componentDidMount() {
        this.loadData()
        .then((result) => {
          
        })
    }

    async loadData() {
        
    }

    render() {
      

        return (
            <Grid columns={2} stackable>
                <Grid.Column width={10}>
                    <Segment basic>
                        <div className="textPoster" >
                            <h1 className="main-title">LEARN. BUILD. SHIP.</h1>
                            <p className="text1">NEAR Protocol Dapp Development Guild</p>
                            <p className="text2">Join us in ushering in Web 3.0 with blockchain solutions for real-world issues.</p>
                        </div>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Segment basic>
                        <div className="imagePoster">
                            <ImageLoader image={VPGuildLogo} style={{ width: '100%' }} />
                         </div>
                    </Segment>
                </Grid.Column>          
            </Grid>
        )
    }
}

export default Poster