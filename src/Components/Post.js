import React, { useEffect, useState } from 'react'
import './Post.css'
import Avatar from '@mui/material/Avatar';
import { db } from '../firebaseConfig';
import { query, orderBy, addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';

function Post(props) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("")

    useEffect(() => {
        let unsubscribe;
        if (props.postId) {
            const commentsRef = collection(db, 'posts', props.postId, 'comments');
            const commentsQuery = query(commentsRef, orderBy('timestamp', 'desc'));
            unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
                setComments(snapshot.docs.map(doc => doc.data()));
            });
        }

        return () => unsubscribe();
    }, [props.postId])

    const postComment = (event) => {
        event.preventDefault();

        addDoc(collection(db, "posts", props.postId, "comments"), {
            text: comment,
            username: props.user.displayName,
            timestamp: serverTimestamp()
        });
        setComment("");
    }

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

            <div className='post__comments'>
                {comments.map((comment) => {
                    return <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>
                })}
            </div>


            {props.user && <form className='post__commentBox'>
                <input
                    className='post__input'
                    type='text'
                    placeholder='Add a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    className='post__button'
                    disabled={!comment}
                    type='submit'
                    onClick={postComment}
                >
                    Post
                </button>
            </form>}


            {/* {header -> avatar + username} */}
            {/* {image} */}
            {/* {username + caption} */}
        </div>
    )
}

export default Post
