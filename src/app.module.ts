import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { ExpertModule } from './expert/expert.module';
import { AdminModule } from './admin/admin.module';
import { BlogModule } from './blog/blog.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    UsersModule,
    AppointmentsModule,
    AuthModule,
    ExpertModule,
    AdminModule,
    BlogModule
  ],
})
export class AppModule {}
