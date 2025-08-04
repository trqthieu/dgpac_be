import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserRequest,
  UserRequestSchema,
} from 'src/schemas/user-request.schema';
import { UserRequestService } from './user-request.service';
import { UserRequestController } from './user-request.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserRequest.name, schema: UserRequestSchema },
    ]),
  ],
  controllers: [UserRequestController],
  providers: [UserRequestService],
  exports: [UserRequestService],
})
export class UserRequestModule {}
