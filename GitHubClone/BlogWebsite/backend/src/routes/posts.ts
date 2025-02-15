import express from 'express';
import { Router } from 'express';
import Post from '../models/Post';

const router: Router = express.Router();

router.post('/', async (req: any, res: any) => {
  try {
    const { title, content, images = [], author = 'anonymous' } = req.body;
    
    // 유효성 검사
    if (!title) {
      return res.status(400).json({ error: '제목은 필수입니다.' });
    }
    if (!content) {
      return res.status(400).json({ error: '내용은 필수입니다.' });
    }

    const post = await Post.create({
      title,
      content,
      images,
      author
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Error saving post' });
  }
});
  
// 모든 게시글 조회
router.get('/', async (req: any, res: any) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// 특정 게시글 조회
router.get('/:id', async (req: any, res: any) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// 게시글 삭제
router.delete('/:id', async (req: any, res: any) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await post.destroy();
    res.status(204).send(); // 성공적으로 삭제됨
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// 게시글 수정
router.put('/:id', async (req: any, res: any) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: '제목은 필수입니다.' });
    }
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: '내용은 필수입니다.' });
    }

    await post.update({ 
      title: title.trim(),
      content: content.trim() 
    });

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Error updating post' });
  }
});

export default router;