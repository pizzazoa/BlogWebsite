import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts/${id}`);
        if (!response.ok) throw new Error('Post not found');
        const post = await response.json();
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();  // 백엔드에서 보낸 에러 메시지를 받음
        throw new Error(errorData.error);
      }

      alert('글이 수정되었습니다.');
      navigate(`/posts/${id}`);
    } catch (err) {
        alert(err instanceof Error ? err.message : '글 수정에 실패했습니다.');
        console.error('Error updating post:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 mr-4 p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/posts/${id}`)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              수정완료
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20">
        <MDEditor
          value={content}
          onChange={(value) => setContent(value || '')}
          height={500}
        />
      </div>
    </div>
  );
}

export default EditPost;