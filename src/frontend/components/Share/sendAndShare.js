import React from 'react';
import { ShareIt } from './shareIt';

export const SendAndShare = ({ backShowHandler }) => {
    let style = { display: "flex", flexDirection: "column", margin: "auto" }
    return (
        <div>
          
            <span style={style}>
                <ShareIt clicked={backShowHandler} />
            </span>
        </div>
    )
}