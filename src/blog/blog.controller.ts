// src/blog/blog.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';

@Controller('blogs')
@ApiBearerAuth()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    // return this.blogService.create(createBlogDto);
  }
}
