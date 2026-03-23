import React, { useState } from 'react'
import { createPost, getPosts } from '../../api/post';
import './PostForm.css'


const PostForm = ({ user, setPosts }) => {
  const [text,setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!text.trim()){
      alert("投稿内容を入力してください");
    return;
    }

    try {
      const newPost = await createPost(text, user);
      setPosts((prev) => [newPost, ...prev]);
      setText("");
    }
    catch (error) {
      console.error("投稿に失敗しました", error);
    }
  };
  

  return (
    <div>
      <div className='profile'>
        <div className='user-info'>
          <h3 className='name'>{user?.name}</h3>
          <p className='email'>{user?.email}</p>
        </div>
      </div>
      
      

      <form onSubmit={handleSubmit}>
        <textarea
          className='input-area'
          value={text}
          placeholder='投稿内容'
          onChange={(e)=>setText(e.target.value)}
          rows={5}

        />
          <button type='submit' className='post-btn' disabled={!text.trim()}>投稿</button>
      </form>
    </div>
  )
}
export default PostForm;



