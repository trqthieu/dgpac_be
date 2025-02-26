// src/admin/admin.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Service, ServiceDocument } from '../schemas/service.schema';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
} from '../schemas/appointment.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  // Dashboard: aggregate appointment stats and total revenue
  async getDashboardStats(period: 'week' | 'month' | 'year'): Promise<any> {
    const now = new Date();
    let startDate: Date;
    if (period === 'week') {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );
    } else if (period === 'month') {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
      );
    } else if (period === 'year') {
      startDate = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate(),
      );
    } else {
      throw new BadRequestException('Invalid period');
    }

    // Using aggregation pipeline to calculate total appointments and revenue
    const stats = await this.appointmentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          // Consider appointments that are confirmed or completed
          status: {
            $in: [AppointmentStatus.Confirmed, AppointmentStatus.Completed],
          },
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceData',
        },
      },
      { $unwind: '$serviceData' },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          totalRevenue: { $sum: '$serviceData.price' },
        },
      },
    ]);
    return stats[0] || { totalAppointments: 0, totalRevenue: 0 };
  }

  async getRevenueReport(fromDate: string, toDate: string): Promise<any> {
    console.log('🚀 ~ AdminService ~ getRevenueReport ~ fromDate:', fromDate);
    // Validate dates
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    // Ensure that fromDate is before toDate
    if (from > to) {
      throw new BadRequestException('fromDate must be before toDate');
    }
    // Aggregate revenue data:
    const report = await this.appointmentModel.aggregate([
      {
        $match: {
          appointmentTime: {
            ...(from ? { $gte: from } : {}),
            ...(to ? { $lte: to } : {}),
          },
          // Optionally filter by appointment status
          status: {
            $in: [AppointmentStatus.Confirmed, AppointmentStatus.Completed],
          },
        },
      },
      {
        $lookup: {
          from: 'services', // the collection name for Service
          localField: 'serviceId',
          foreignField: '_id',
          as: 'serviceInfo',
        },
      },
      { $unwind: '$serviceInfo' },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appointmentTime' },
          },
          totalRevenue: { $sum: '$serviceInfo.price' },
          appointmentCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return report;
  }

  // User management
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ createdAt: 'desc' }).exec();
  }

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    // Check if a user with the given email already exists
    const existingUser = await this.userModel
      .findOne({ email: dto.email })
      .exec();
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // Create a new user document
    const newUser = new this.userModel({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      role: dto.role, // default role for created users
      avatar: dto.avatar, // default role for created users
      isBlocked: false,
      address: dto.address,
    });
    return newUser.save();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, updateDto: any): Promise<UserDocument> {
    let passwordHash;
    if (updateDto.password) {
      const saltRounds = 10;
      passwordHash = await bcrypt.hash(updateDto.password, saltRounds);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, { ...updateDto, passwordHash }, { new: true })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async lockUser(id: string): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, { isBlocked: true }, { new: true })
      .exec();
  }

  async unlockUser(id: string): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, { isBlocked: false }, { new: true })
      .exec();
  }

  // Service management
  async getAllServices(): Promise<ServiceDocument[]> {
    return this.serviceModel
      .find({ active: true })
      .populate(['expertId'])
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getServiceById(id: string): Promise<ServiceDocument> {
    const service = await this.serviceModel
      .findById(id)
      .populate(['expertId'])
      .exec();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async createService(serviceDto: any): Promise<ServiceDocument> {
    const service = new this.serviceModel(serviceDto);
    return service.save();
  }

  async updateService(id: string, serviceDto: any): Promise<ServiceDocument> {
    const service = await this.serviceModel
      .findByIdAndUpdate(id, serviceDto, { new: true })
      .exec();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async deleteService(id: string): Promise<any> {
    return this.serviceModel.findByIdAndUpdate(id, { active: false }).exec();
  }

  // Appointment history: list all appointments (with population for detail)
  async getAllAppointments(): Promise<AppointmentDocument[]> {
    return this.appointmentModel
      .find()
      .populate(['userId', 'expertId', 'serviceId']).sort({ createdAt: 'desc' })
      .exec();
  }

  async getProfile(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async getAppointmentDetail(id: string): Promise<Appointment> {
    return this.appointmentModel
      .findOne({ _id: id })
      .populate(['expertId', 'userId', 'serviceId'])
      .exec();
  }
}
