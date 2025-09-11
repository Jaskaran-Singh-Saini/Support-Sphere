import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SkeletonPostCard from '../components/SkeletonPostCard';

const mockPosts = [
  { id: 1, title: 'Feeling overwhelmed with exam pressure', author: 'User 123', replies: 5 },
  { id: 2, title: 'How do you deal with homesickness?', author: 'User 456', replies: 12 },
  { id: 3, title: 'Just wanted to share a small win today!', author: 'User 789', replies: 8 },
];

function ForumListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from a backend
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 2000); // Simulate a 2-second delay
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
                  <span>Posted by {post.author}</span>
                  <span>{post.replies} replies</span>
                </div>
              </Link>
            ))
          ) : (
            <p>No posts yet. Be the first to share!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForumListPage;