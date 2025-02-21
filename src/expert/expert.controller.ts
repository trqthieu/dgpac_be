// src/experts/expert.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpertService } from './expert.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';

@Controller('expert')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  // Profile endpoints
  @Get('profile')
  async getProfile(@Req() req) {
    return this.expertService.getProfile(req.user);
  }

  @Put('profile')
  async updateProfile(@Req() req, @Body() updateData: UpdateProfileDto) {
    return this.expertService.updateProfile(req.user, updateData);
  }

  // Service management endpoints
  @Post('services')
  async createService(@Req() req, @Body() dto: CreateServiceDto) {
    return this.expertService.createService(req.user, dto);
  }

  @Get('services')
  async listServices(@Req() req) {
    return this.expertService.listServices(req.user);
  }

  @Get('my-services')
  async listMyServices(@Req() req) {
    return this.expertService.listMyServices(req.user);
  }

  @Get('services/:id')
  async getService(@Param('id') id: string) {
    return this.expertService.getServiceById(id);
  }

  @Put('services/:id')
  async updateService(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.expertService.updateService(req.user, id, dto);
  }

  @Delete('services/:id')
  async deleteService(@Req() req, @Param('id') id: string) {
    return this.expertService.deleteService(req.user, id);
  }

  @Put('register-services/:id')
  async registerService(@Req() req, @Param('id') id: string) {
    return this.expertService.registerService(req.user, id);
  }

  @Put('unregister-services/:id')
  async removeExpertFromService(@Req() req, @Param('id') id: string) {
    return this.expertService.removeExpertFromService(req.user, id);
  }

  // Appointment endpoints
  @Get('appointments')
  async listAppointments(@Req() req) {
    return this.expertService.listAppointments(req.user);
  }

  @Get('appointments/:id')
  async getAppointmentDetail(@Req() req, @Param('id') id: string) {
    return this.expertService.getAppointmentDetail(id);
  }

  @Patch('appointments/:id/accept')
  async acceptAppointment(@Req() req, @Param('id') id: string) {
    return this.expertService.updateAppointmentStatus(
      req.user,
      id,
      'confirmed',
    );
  }

  @Patch('appointments/:id/decline')
  async declineAppointment(@Req() req, @Param('id') id: string) {
    return this.expertService.updateAppointmentStatus(req.user, id, 'declined');
  }

  // Notification endpoint
  @Get('notifications')
  async listNotifications(@Req() req) {
    return this.expertService.listNotifications(req.user);
  }
}
