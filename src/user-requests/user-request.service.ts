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
import { Parser } from 'json2csv';
import { Response } from 'express'; // if used in controller
import * as ExcelJS from 'exceljs';

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
    const searchQuery = query.search
      ? { companyName: { $regex: query.search, $options: 'i' } }
      : {};

    const [data, total] = await Promise.all([
      this.userRequestModel
        .find(searchQuery)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit),
      this.userRequestModel.countDocuments(searchQuery),
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

  async exportToCsv(): Promise<string> {
    const userRequest = await this.userRequestModel
      .find()
      .sort({ createdAt: 'desc' })
      .exec();
    const fields = [
      '_id',
      'name',
      'companyName',
      'email',
      'phone',
      'location',
      'request',
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(userRequest);

    return csv;
  }

  async exportToXlsx() {
    const userRequest = await this.userRequestModel
      .find()
      .sort({ createdAt: 'desc' })
      .exec();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Blogs');

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 24 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Company Name', key: 'companyName', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Request', key: 'request', width: 50 },
      { header: 'Safety DataSheet', key: 'safetyDataSheet', width: 50 },
      { header: 'Packing List', key: 'packingList', width: 50 },
    ];

    userRequest.forEach((item) => {
      worksheet.addRow({
        _id: item._id.toString(),
        name: item.name,
        companyName: item.companyName,
        email: item.email,
        phone: item.phone,
        location: item.location,
        request: item.request,
        safetyDataSheet: item.safetyDataSheet,
        packingList: item.packingList,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
