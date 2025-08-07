// src/blog/blog.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { PaginationQueryDto } from 'src/config/dto/pagination';


@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.blogModel(createBlogDto);
    return createdBlog.save();
  }

  async findAll(query: PaginationQueryDto) {
    const page = +query?.page || 1;
    const limit = +query?.limit || 10;
    const skip = (page - 1) * limit;
    const searchQuery = query.search
    ? { title: { $regex: query.search, $options: 'i' } }
    : {};

    const [data, total] = await Promise.all([
      this.blogModel
        .find(searchQuery)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.blogModel.countDocuments(searchQuery),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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
}
