import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  images: string[];
  author: string;
}

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      alert('글이 삭제되었습니다.');
      navigate('/'); // 메인 페이지로 리다이렉트
    } catch (err) {
      alert('글 삭제에 실패했습니다.');
      console.error('Error deleting post:', err);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts/${id}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 mb-4">{error || 'Post not found'}</div>
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
        <div className="space-x-2">
          <Link
            to={`/edit/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
      
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          {post.author && <span className="ml-4">by {post.author}</span>}
        </div>
        
        {post.images && post.images.length > 0 && (
          <div className="mb-8">
            {post.images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full max-h-96 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="markdown-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

export default PostDetail;