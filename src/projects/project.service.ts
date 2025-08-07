import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PaginationQueryDto } from 'src/config/dto/pagination';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private ProjectModel: Model<ProjectDocument>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    return new this.ProjectModel(dto).save();
  }

  async findAll(query: PaginationQueryDto) {
    const page = +query?.page || 1;
    const limit = +query?.limit || 10;
    const skip = (page - 1) * limit;
    const searchQuery = query.search
    ? { title: { $regex: query.search, $options: 'i' } }
    : {};

    const [data, total] = await Promise.all([
      this.ProjectModel.find(searchQuery)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.ProjectModel.countDocuments(searchQuery),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.ProjectModel.findById(id);
    if (!project)
      throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const updated = await this.ProjectModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updated)
      throw new NotFoundException(`Project with id ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.ProjectModel.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new NotFoundException(`Project with id ${id} not found`);
    return { message: 'Project deleted successfully' };
  }
}
