import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

export enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Declined = 'declined',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', required: true })
  userId: string; // Reference to the User booking the appointment

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', required: false })
  expertId?: string; // Optional reference if user selects a specific expert

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'services', required: true })
  serviceId: string; // The ID of the service booked

  @Prop({ required: true })
  appointmentTime: Date;

  @Prop({
    required: true,
    enum: AppointmentStatus,
    default: AppointmentStatus.Pending,
  })
  status: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
