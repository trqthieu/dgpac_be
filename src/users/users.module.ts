import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/appointment.schema';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';
import { Review, ReviewSchema } from 'src/schemas/review.schema';
import { Service, ServiceSchema } from 'src/schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
