import React, { useEffect, useState } from 'react'
import { db } from './Firebase'
import { collection, getDocs,addDoc,serverTimestamp,query,orderBy } from 'firebase/firestore'
import './posts.css'
import Avatar from '@mui/material/Avatar'

async function get_comments(id, set_method)
{
  const docref = query(collection(db, `posts/${id}/comments`), orderBy('timestamp', 'desc'))
  let snapshots = await getDocs(docref)
  let array = []
  snapshots.forEach((doc) => {
    let obj = {
      username: doc.data().username,
      text: doc.data().text
    }
    array.push(obj)
  })
  set_method(array)
}

async function post_comment(id, text, username)
{
  const addocument = await addDoc(collection(db, `posts/${id}/comments`), {
    text: text,
    username: username,
    timestamp: serverTimestamp()
  })
  console.log(addocument.id)
}

function Posts({imageUrl, username, caption, postId, user}) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  useEffect(() => {
    return(() => {
      get_comments(postId, setComments)
    })
  }, [postId])

  const postComment = (event) => {
    event.preventDefault()
    post_comment(postId, comment, user.displayName)
    setComment('')
  }
  return (
    <div className="post">
        <div className="post__header">
            <Avatar
            className="post__avatar"
            alt= {username}
            src="/static/images/avatar/1.jpg"
            />
            <h3>{username}</h3>
        </div>
        <img className="post__image" src={imageUrl} alt=""></img>
        <h2 className="post__text"><strong>{username}</strong>: {caption}</h2>
        <div className="post__comments">
          {
            comments.map((comment) => (
              <p>
                <strong>{comment.username}</strong>: {comment.text}
              </p>
            ))
          }
        </div>
        {user && (
          <form className="post__commentbox">
          <input
          className="post__input"
          type="text"
          placeholder = "Type comments here....."
          value={comment}
          onChange = {(e) => setComment(e.target.value)}
          />
          <button
          className="post__button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
          >
            Post 
          </button>
        </form>
        )}
    </div>
  )
}

export default Posts