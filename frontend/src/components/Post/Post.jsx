import React from 'react'
import './Post.css'

const Post = ({ post }) => {
  const formattedDate = post.createdAt ?
  new Date(post.createdAt).toLocaleString()
  : '日時不明';

  const userName = post.user?.name || '匿名ユーザー';

  return (
    <div className='post-card'>
      <div className='post-header'>
          <span className='post-user-name'>{userName}</span>
          <div className='post-date'>{formattedDate}</div>
      </div>
      <div className='post-content'>{post.content}</div>
    </div>
  )
}

export default Post