import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRequestService } from './user-request.service';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from './dto/user-request.dto';
import { PaginationQueryDto } from 'src/config/dto/pagination';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('User Requests')
@Controller('user-requests')
@ApiBearerAuth()
export class UserRequestController {
  constructor(private readonly service: UserRequestService) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.service.findOne(id);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   @Put(':id')
//   async update(@Param('id') id: string, @Body() dto: UpdateUserRequestDto) {
//     return this.service.update(id, dto);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return this.service.remove(id);
//   }
}
