import React from 'react'
import './Post.css'
import Avatar from '@mui/material/Avatar';

function Post(props) {
    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar
                    className='post__avatar'
                    alt='Cockpit02'
                    src=''
                />
                <h3>{props.username}</h3>
            </div>
            <img className='post__image' src={props.imageURL} alt='' />
            <h4 className='post__text'><strong>{props.username}</strong>  {props.caption}</h4>

            {/* {header -> avatar + username} */}
            {/* {image} */}
            {/* {username + caption} */}
        </div>
    )
}

export default Post
