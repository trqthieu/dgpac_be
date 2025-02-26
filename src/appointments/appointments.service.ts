import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument, AppointmentStatus } from '../schemas/appointment.schema';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async createAppointment(createDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = new this.appointmentModel({
      ...createDto,
      status: AppointmentStatus.Pending, // default status
    });
    return appointment.save();
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return appointment;
  }

  async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findByIdAndUpdate(appointmentId, { status }, { new: true })
      .exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
    }
    return appointment;
  }

  async listAppointmentsForUser(userId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ userId }).sort({ createdAt: 'desc' }).exec();
  }

  async listAppointmentsForExpert(expertId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ expertId }).sort({ createdAt: 'desc' }).exec();
  }
}
