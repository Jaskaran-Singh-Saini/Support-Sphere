import { useParams, Link } from 'react-router-dom';

const posts = [
    { id: 1, title: 'Feeling overwhelmed with exam pressure', author: 'AnonymousPanda', time: '2h ago', content: 'Exams are coming up and I feel like I can\'t handle the pressure. Does anyone have any tips for staying calm and focused?', comments: [{id: 1, author: 'HelpfulBadger', text: 'I find the Pomodoro Technique really helps! 25 mins of focused study and then a 5 min break.'}, {id: 2, author: 'WiseOwl', text: 'Make sure you\'re getting enough sleep. It makes a huge difference.'}]},
    { id: 2, title: 'How do you deal with homesickness?', author: 'QuietFox', time: '8h ago', content: 'I just moved into the hostel and I\'m feeling really homesick. It\'s hard to make friends. What should I do?', comments: [{id: 3, author: 'FriendlyCapybara', text: 'Try joining a club or a sports team! It\'s a great way to meet people with similar interests.'}]},
    { id: 3, title: 'Just wanted to share a small win today!', author: 'HappyTurtle', time: '1d ago', content: 'I was really nervous about my presentation but I did it and it went well! Feeling proud of myself.', comments: []},
];

function ForumPostPage() {
  const { postId } = useParams();
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/forum" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to All Posts
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2 mb-4">
            <span>Posted by {post.author}</span>
            <span>{post.time}</span>
          </div>
          <p className="text-gray-700 text-lg">{post.content}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Replies ({post.comments.length})</h2>
          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-700">{comment.author}</p>
                <p className="text-gray-600">{comment.text}</p>
              </div>
            ))}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
                <textarea className="w-full p-2 border border-gray-300 rounded-lg" rows="3" placeholder="Write your reply..."></textarea>
                <button className="mt-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Post Reply</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForumPostPage;