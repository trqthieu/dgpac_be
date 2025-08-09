import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import {
  CreateProjectDto,
  ProjectFilterQueryDto,
  UpdateProjectDto,
} from './dto/project.dto';
import { PaginationQueryDto } from 'src/config/dto/pagination';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private ProjectModel: Model<ProjectDocument>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    dto.slug = dto.slug ? this.formatSlug(dto.slug) : this.formatSlug(dto.title);
    return new this.ProjectModel(dto).save();
  }

  // async findAll(query: ProjectFilterQueryDto) {
  //   const page = +query?.page || 1;
  //   const limit = +query?.limit || 10;
  //   const skip = (page - 1) * limit;
  //   const searchQuery = query.search
  //   ? { title: { $regex: query.search, $options: 'i' } }
  //   : {};

  //   const [data, total] = await Promise.all([
  //     this.ProjectModel.find(searchQuery)
  //       .sort({ createdAt: 'desc' })
  //       .skip(skip)
  //       .limit(limit)
  //       .exec(),
  //     this.ProjectModel.countDocuments(searchQuery),
  //   ]);

  //   return { data, total, page, totalPages: Math.ceil(total / limit) };
  // }

  async findAll(query: ProjectFilterQueryDto) {
    const page = +query?.page || 1;
    const limit = +query?.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    if (query.industries && query.industries.length > 0) {
      filter.industry = { $in: query.industries };
    }

    if (query.works && query.works.length > 0) {
      filter.work = { $in: query.works };
    }

    console.log('Filter:', filter);

    const [data, total] = await Promise.all([
      this.ProjectModel.find(filter)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.ProjectModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRelated(projectId: string, query: PaginationQueryDto) {
  const page = +query?.page || 1;
  const limit = +query?.limit || 10;
  const skip = (page - 1) * limit;

  // Find the current project
  const currentProject = await this.ProjectModel.findById(projectId);
  if (!currentProject) {
    throw new NotFoundException('Project not found');
  }

  const filter = {
    _id: { $ne: projectId }, // exclude current project
    $or: [
      { work: currentProject.work },
      { industry: currentProject.industry },
    ],
  };

  const [data, total] = await Promise.all([
    this.ProjectModel.find(filter)
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)
      .exec(),
    this.ProjectModel.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}


  async findOne(id: string): Promise<Project> {
    let project = null
    const projectWithSlug = await this.ProjectModel.findOne({ slug: id });
    if(projectWithSlug){
      project = projectWithSlug;
    } else{
      const projectWithId = await this.ProjectModel.findById(id);
      project = projectWithId;
    }
    if (!project)
      throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const existingProject = await this.ProjectModel.findById(id);
    if (!existingProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    if (dto.slug || dto.title) {
      dto.slug = dto.slug ? this.formatSlug(dto.slug) : this.formatSlug(dto.title);
    }
    const updated = await this.ProjectModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updated) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.ProjectModel.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new NotFoundException(`Project with id ${id} not found`);
    return { message: 'Project deleted successfully' };
  }


   private formatSlug(value: string): string {
    return value
      ? value
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
          .replace(/\s+/g, '-')         // spaces to hyphen
          .replace(/-+/g, '-')           // collapse multiple hyphens
      : value;
  }
}
