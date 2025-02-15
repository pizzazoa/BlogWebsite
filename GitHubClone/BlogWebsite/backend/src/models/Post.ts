import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface PostAttributes {
  id?: number;
  title: string;
  content: string;
  images: string[];
  author: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Post extends Model<PostAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public images!: string[];
  public author!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: 'anonymous',
    },
  },
  {
    sequelize,
    modelName: 'Post',
    timestamps: true,
    tableName: 'posts',
  }
);

export default Post;