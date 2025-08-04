import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserRequest,
  UserRequestDocument,
} from 'src/schemas/user-request.schema';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from './dto/user-request.dto';
import { PaginationQueryDto } from 'src/config/dto/pagination';

@Injectable()
export class UserRequestService {
  constructor(
    @InjectModel(UserRequest.name)
    private readonly userRequestModel: Model<UserRequestDocument>,
  ) {}

  async create(dto: CreateUserRequestDto): Promise<UserRequest> {
    return new this.userRequestModel(dto).save();
  }

  async findAll(query: PaginationQueryDto) {
    const page = +query?.page || 1;
    const limit = +query?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userRequestModel
        .find()
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit),
      this.userRequestModel.countDocuments(),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<UserRequest> {
    const found = await this.userRequestModel.findById(id);
    if (!found)
      throw new NotFoundException(`UserRequest with id ${id} not found`);
    return found;
  }

  async update(id: string, dto: UpdateUserRequestDto): Promise<UserRequest> {
    const updated = await this.userRequestModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated)
      throw new NotFoundException(`UserRequest with id ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userRequestModel.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new NotFoundException(`UserRequest with id ${id} not found`);
    return { message: 'User request deleted successfully' };
  }
}
