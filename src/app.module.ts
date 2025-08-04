import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ProductModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import * as dotenv from 'dotenv';
import { ProjectModule } from './projects/project.module';
import { UserRequestModule } from './user-requests/user-request.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    UsersModule,
    ProductModule,
    AuthModule,
    BlogModule,
    ProjectModule,
    UserRequestModule
  ],
})
export class AppModule {}
