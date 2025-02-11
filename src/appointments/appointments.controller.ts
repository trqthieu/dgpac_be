import { Controller, Body, Get, Param, Post, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '../schemas/appointment.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'The appointment has been successfully created.' })
  async create(@Body() createDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(createDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by id' })
  async getById(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, status);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'List appointments for a user' })
  async listForUser(@Param('userId') userId: string) {
    return this.appointmentsService.listAppointmentsForUser(userId);
  }

  @Get('/expert/:expertId')
  @ApiOperation({ summary: 'List appointments for an expert' })
  async listForExpert(@Param('expertId') expertId: string) {
    return this.appointmentsService.listAppointmentsForExpert(expertId);
  }
}
