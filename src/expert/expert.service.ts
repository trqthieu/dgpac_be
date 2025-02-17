// src/experts/expert.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { Appointment, AppointmentStatus } from '../schemas/appointment.schema';
import { Notification } from '../schemas/notification.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';

@Injectable()
export class ExpertService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  // Return expert's personal profile
  async getProfile(user: any): Promise<any> {
    const expert = await this.userModel.findById(user._id).lean().exec();
    if (!expert || expert.role !== 'expert') {
      throw new NotFoundException('Expert not found');
    }
    return expert;
  }

  // Update expert profile
  async updateProfile(user: any, updateData: UpdateProfileDto): Promise<any> {
    const updated = await this.userModel
      .findByIdAndUpdate(user._id, updateData, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Expert not found');
    }
    return updated;
  }

  // Service management: Create a new service
  async createService(user: any, dto: CreateServiceDto): Promise<Service> {
    if (user.role !== 'expert') {
      throw new ForbiddenException('Only experts can create services');
    }
    const newService = new this.serviceModel({
      expertId: user._id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      duration: dto.duration,
      imageUrl: dto.imageUrl,
    });
    return newService.save();
  }

  // List all services offered by the expert
  async listServices(user: any): Promise<Service[]> {
    if (user.role !== 'expert') {
      throw new ForbiddenException('Only experts can view services');
    }
    return this.serviceModel
      .find({ expertId: user._id })
      .populate(['expertId'])
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

  // Update an expert's service
  async updateService(
    user: any,
    serviceId: string,
    dto: UpdateServiceDto,
  ): Promise<Service> {
    if (user.role !== 'expert') {
      throw new ForbiddenException('Only experts can update services');
    }
    const service = await this.serviceModel
      .findOne({ _id: serviceId, expertId: user._id })
      .exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    Object.assign(service, dto);
    return service.save();
  }

  // Delete a service offered by the expert
  async deleteService(user: any, serviceId: string): Promise<any> {
    if (user.role !== 'expert') {
      throw new ForbiddenException('Only experts can delete services');
    }
    const result = await this.serviceModel
      .deleteOne({ _id: serviceId, expertId: user._id })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Service not found');
    }
    return { message: 'Service deleted successfully' };
  }

  // List all appointments for the expert
  async listAppointments(user: any): Promise<Appointment[]> {
    if (user.role !== 'expert') {
      throw new ForbiddenException('Only experts can view appointments');
    }
    return this.appointmentModel
      .find({ expertId: user._id })
      .populate(['expertId', 'userId', 'serviceId'])
      .exec();
  }

  async getAppointmentDetail(id: string): Promise<Appointment> {
    return this.appointmentModel
      .findOne({ _id: id })
      .populate(['expertId', 'userId', 'serviceId'])
      .exec();
  }

  // Update appointment status (accept/decline)
  async updateAppointmentStatus(
    user: any,
    appointmentId: string,
    status: string,
  ): Promise<Appointment> {
    if (user.role !== 'expert') {
      throw new ForbiddenException(
        'Only experts can update appointment status',
      );
    }
    // Allow only confirmed or declined statuses
    if (
      ![AppointmentStatus.Confirmed, AppointmentStatus.Declined].includes(
        status as AppointmentStatus,
      )
    ) {
      throw new BadRequestException('Invalid status');
    }
    const appointment = await this.appointmentModel
      .findOne({ _id: appointmentId, expertId: user._id })
      .exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    appointment.status = status as AppointmentStatus;
    return appointment.save();
  }

  // List notifications for the expert
  async listNotifications(user: any): Promise<Notification[]> {
    if (user.role !== 'expert') {
      throw new ForbiddenException('Only experts can view notifications');
    }
    return this.notificationModel.find({ expertId: user._id }).exec();
  }
}
