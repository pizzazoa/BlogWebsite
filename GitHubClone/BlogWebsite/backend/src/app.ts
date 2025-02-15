import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import postsRouter from './routes/posts';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/posts', postsRouter);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Blog API is running');
});

const startServer = async () => {
  try {
    // 데이터베이스 연결 및 테이블 동기화
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    await sequelize.sync();
    console.log('Models synchronized with database.');

    // 서버 시작
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();

export default app;