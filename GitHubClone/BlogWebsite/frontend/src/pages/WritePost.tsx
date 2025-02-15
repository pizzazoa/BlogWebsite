'use client';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from 'react-router-dom';

function WritePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePost = () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return false;
    }
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    try {
      const response = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author: 'anonymous' // 나중에 로그인 기능 추가 시 수정
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      alert('게시글이 저장되었습니다.');
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시글 저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="flex-1 mr-4 p-2 border rounded"
          />
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            게시
          </button>
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

export default WritePost;