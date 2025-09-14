import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill out both the title and content.');
      return;
    }

    axios.post('http://127.0.0.1:8000/api/posts/', { title, content })
      .then(response => {
        toast.success('Post submitted successfully!');
        navigate('/forum'); // Redirect to the forum list
      })
      .catch(error => {
        console.error("Error creating post:", error);
        toast.error('Could not submit post. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create a New Post
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a descriptive title..."
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Your thoughts
              </label>
              <textarea
                id="content"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your thoughts anonymously..."
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Link to="/forum" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                Cancel
              </Link>
              <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                Submit Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePostPage;