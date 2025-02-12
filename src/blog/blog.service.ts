// src/blog/blog.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.blogModel(createBlogDto);
    return createdBlog.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .exec();
    if (!updatedBlog) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }
    return updatedBlog;
  }

  async remove(id: string): Promise<any> {
    const result = await this.blogModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }
    return { message: 'Blog post deleted successfully' };
  }

  // Create a comment for a blog post.
  async createComment(
    blogId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = new this.commentModel({
      blogId: blogId,
      userId: userId,
      content: dto.content,
    });
    return comment.save();
  }

  // List all comments for a specific blog post.
  async listCommentsByBlog(blogId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ blogId: blogId })
      .populate('userId', 'fullName email') // optionally populate user fields
      .sort({ createdAt: -1 })
      .exec();
  }
}
