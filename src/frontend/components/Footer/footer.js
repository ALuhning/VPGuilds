import React from 'react';
import ImageLoad from '../common/ImageLoad/ImageLoad'
import vitalPointAILogo from '../../../assets/vitalpointai.png'
import { Grid } from 'semantic-ui-react'
import './footer.css';

const Footer = () => (
    <Grid.Column width={16}>
    <div className="footer">
        <div className="left">
            <ImageLoad image={vitalPointAILogo} style={{height: "7em"}} />
            <div className="footertext">
                <p>A Vital Point AI project.</p>
                <p>Powering augmented cognition</p>
                <p>with blockchain, data and MR.</p>
                <p>Learn more at 
                    <a
                        href="https://vitalpoint.ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blue" > vitalpoint.ai</a></p>
            </div>
        </div>
        <div className="rightside">
            <p>© 2020 Vital Point AI  </p>
            <p>All Rights Reserved.</p>
            <p className="blue">Privacy Policy  <span className="black"> | </span>  Terms of Use</p>
        </div>

    </div>
    </Grid.Column>
)

export default Footer