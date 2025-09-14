import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ForumPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/posts/${postId}/`)
      .then(response => {
        setPost(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, [postId]);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    axios.post('http://127.0.0.1:8000/api/comments/', {
      post: postId,
      content: newComment,
    })
    .then(response => {
      // Add the new comment to the state to show it instantly
      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data]
      }));
      setNewComment('');
      toast.success('Reply posted successfully!');
    })
    .catch(error => {
      console.error("Error posting comment:", error);
      toast.error('Could not post reply. Please try again.');
    });
  };

  if (loading) {
    return <div className="p-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="p-8">Post not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/forum" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to All Posts
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2 mb-4">
            <span>Posted by {post.author_username}</span>
          </div>
          <p className="text-gray-700 text-lg whitespace-pre-wrap">{post.content}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Replies ({post.comments.length})</h2>
          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-700">{comment.author_username}</p>
                <p className="text-gray-600 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
                <form onSubmit={handleCommentSubmit}>
                    <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg" 
                        rows="3" 
                        placeholder="Write your reply..."
                    ></textarea>
                    <button type="submit" className="mt-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                        Post Reply
                    </button>
                </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForumPostPage;