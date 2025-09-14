import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SkeletonPostCard from '../components/SkeletonPostCard';

function ForumListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from our live Django API
    axios.get('http://127.0.0.1:8000/api/posts/')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching forum posts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Peers Forum</h1>
            <p className="text-gray-600">A safe space to share and connect.</p>
          </div>
          <Link to="/forum/new" className="mt-4 sm:mt-0 inline-block w-full sm:w-auto text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
            Create Post
          </Link>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-center">
            Interested in helping others? <Link to="/apply-volunteer" className="font-bold hover:underline">Apply to be a Peer Support Volunteer</Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <SkeletonPostCard />
              <SkeletonPostCard />
              <SkeletonPostCard />
            </>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <Link to={`/forum/${post.id}`} key={post.id} className="block bg-white p-4 rounded-lg shadow-sm border hover:shadow-md">
                <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                  <span>Posted by {post.author_username}</span>
                  <span>{post.comments.length} replies</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-lg border">
                <p className="font-semibold text-gray-700">No posts yet.</p>
                <p className="text-gray-500">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForumListPage;
