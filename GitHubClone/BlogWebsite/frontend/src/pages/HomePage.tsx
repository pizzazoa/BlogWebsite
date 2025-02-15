import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  images: string[];
}

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* 헤더 */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">Chikitoka Archive</h1>
        <Link 
          to="/write" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          글쓰기
        </Link>
      </header>

      {/* 게시글 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link to={`/posts/${post.id}`} key={post.id}>
            <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            {post.images && post.images.length > 0 ? (
              <img 
                src={post.images[0]} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <time className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center text-gray-500 p-8">
          작성된 글이 없습니다. 첫 글을 작성해보세요!
        </div>
      )}
    </div>
  );
}

export default HomePage;