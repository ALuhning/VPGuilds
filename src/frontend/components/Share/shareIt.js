import React from 'react';
import { GrTwitter, GrFacebook } from 'react-icons/gr';

export const ShareIt = ({ clicked }) => {
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