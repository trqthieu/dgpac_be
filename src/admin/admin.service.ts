// src/admin/admin.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { Appointment, AppointmentDocument, AppointmentStatus } from '../schemas/appointment.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  // Dashboard: aggregate appointment stats and total revenue
  async getDashboardStats(period: 'week' | 'month' | 'year'): Promise<any> {
    const now = new Date();
    let startDate: Date;
    if (period === 'week') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    } else {
      throw new BadRequestException('Invalid period');
    }

    // Using aggregation pipeline to calculate total appointments and revenue
    const stats = await this.appointmentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          // Consider appointments that are confirmed or completed
          status: { $in: [AppointmentStatus.Confirmed, AppointmentStatus.Completed] },
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

  // User management
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    // Check if a user with the given email already exists
    const existingUser = await this.userModel.findOne({ email: dto.email }).exec();
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
      role: 'expert', // default role for created users
      isBlocked: false,
    });
    return newUser.save();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, updateDto: any): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async lockUser(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).exec();
  }

  async unlockUser(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).exec();
  }

  // Service management
  async getAllServices(): Promise<ServiceDocument[]> {
    return this.serviceModel.find().exec();
  }

  async getServiceById(id: string): Promise<ServiceDocument> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async createService(serviceDto: any): Promise<ServiceDocument> {
    const service = new this.serviceModel(serviceDto);
    return service.save();
  }

  async updateService(id: string, serviceDto: any): Promise<ServiceDocument> {
    const service = await this.serviceModel.findByIdAndUpdate(id, serviceDto, { new: true }).exec();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async deleteService(id: string): Promise<any> {
    return this.serviceModel.findByIdAndDelete(id).exec();
  }

  // Appointment history: list all appointments (with population for detail)
  async getAllAppointments(): Promise<AppointmentDocument[]> {
    return this.appointmentModel.find().populate('user expert service').exec();
  }
}
