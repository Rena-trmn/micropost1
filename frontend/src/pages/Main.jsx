import { useState, useContext, useEffect } from 'react'
import Header from '../components/Header/Header';
import PostForm from '../components/PostForm/PostForm';
import PostList from '../components/PostList/PostList';
import { UserContext } from '../providers/UserProvider';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../api/post';

const Main = () => {

  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userInfo.token) {
      navigate('/login') ;
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!userInfo.token) return;
    const fetchPosts = async () => {
      try {
        const data = await getPosts(userInfo.token);
        setPosts(data);
      } catch (error) {
        console.error('取得に失敗しました', error);
      }
    };

    fetchPosts();
  }, [userInfo.token]);

  const user = {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    icon:"",
    token: userInfo.token,
  };

  return (
    <div>
      <Header/>
      <div className='layout'>
        <div className='left'>
          <PostForm user={user} setPosts={setPosts}/>
        </div>
        <div className='right'>
          <PostList posts={posts}/>
        </div>
      </div>
    </div>
  )
}

export default Main;


