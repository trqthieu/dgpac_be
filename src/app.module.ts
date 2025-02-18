import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { ExpertModule } from './expert/expert.module';
import { AdminModule } from './admin/admin.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin12345:admin12345@cluster0.lfb12.mongodb.net/massage_booking'),
    UsersModule,
    AppointmentsModule,
    AuthModule,
    ExpertModule,
    AdminModule,
    BlogModule
  ],
})
export class AppModule {}
