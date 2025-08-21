import { useEffect, useState } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import AddPostForm from '../components/AddPostForm';
import Filters from '../components/Filters';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    api.get('/allPosts')
      .then(res => {
        setPosts(res.data);
        setAllPosts(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (text) => {
    api.get(`/posts/${text}`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  };

  const handleAddPost = (newPost) => {
    api.post('/post', newPost)
      .then(res => setPosts(prev => [res.data, ...prev]))
      .catch(err => console.error(err));
  };

  const handleFilter = (type, value) => {
    if (!value) {
      setPosts(allPosts);
      return;
    }
    const filtered = allPosts.filter(post => {
      if (type === 'exp') return post.exp >= parseInt(value);
      if (type === 'tech') return post.techs.map(t => t.toLowerCase()).includes(value.toLowerCase());
      return true;
    });
    setPosts(filtered);
  };

  return (
    <div className="container mt-4">
      <SearchBar onSearch={handleSearch} />
      <AddPostForm onAdd={handleAddPost} />
      <Filters onFilter={handleFilter} />
      <div className="row">
        {posts.length === 0 ? (
          <p className="text-center">No job posts found.</p>
        ) : (
          posts.map((post, i) => <PostCard key={i} post={post} />)
        )}
      </div>
    </div>
  );
}
