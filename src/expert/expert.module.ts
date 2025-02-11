// src/experts/expert.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { Service, ServiceSchema } from 'src/schemas/service.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/appointment.schema';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ExpertController],
  providers: [ExpertService],
})
export class ExpertModule {}
