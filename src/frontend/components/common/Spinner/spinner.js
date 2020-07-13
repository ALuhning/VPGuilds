import React from 'react';
import { Dimmer, Segment, Loader } from 'semantic-ui-react';
import './spinner.css'

const Spinners = () => {
    return (
        <div>
            <Segment>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            </Segment>
        </div>
    )
}

export default Spinners