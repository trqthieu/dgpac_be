// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';
import { BlogService } from 'src/blog/blog.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard stats endpoint: GET /admin/dashboard?period=week|month|year
  @Get('dashboard')
  async getDashboardStats(@Query('period') period: 'week' | 'month' | 'year') {
    return this.adminService.getDashboardStats(period || 'week');
  }

  @Get('report')
  async getRevenueReport(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.adminService.getRevenueReport(fromDate, toDate);
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  // User management endpoints:
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateDto: any) {
    return this.adminService.updateUser(id, updateDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Lock/unlock user endpoints:
  @Put('users/:id/lock')
  async lockUser(@Param('id') id: string) {
    return this.adminService.lockUser(id);
  }

  @Put('users/:id/unlock')
  async unlockUser(@Param('id') id: string) {
    return this.adminService.unlockUser(id);
  }

  // Service management endpoints:
  @Get('services')
  async getAllServices() {
    return this.adminService.getAllServices();
  }

  @Get('services/:id')
  async getService(@Param('id') id: string) {
    return this.adminService.getServiceById(id);
  }

  @Post('services')
  async createService(@Body() serviceDto: any) {
    return this.adminService.createService(serviceDto);
  }

  @Put('services/:id')
  async updateService(@Param('id') id: string, @Body() serviceDto: any) {
    return this.adminService.updateService(id, serviceDto);
  }

  @Delete('services/:id')
  async deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  // Appointment history endpoint:
  @Get('appointments')
  async getAllAppointments() {
    return this.adminService.getAllAppointments();
  }

  @Get('profile')
  async getProfile(@Req() req) {
    console.log(req.user);
    return this.adminService.getProfile(req.user._id);
  }

  // Update user profile
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.adminService.updateProfile(req.user._id, updateProfileDto);
  }

  @Get('appointments/:id')
  async getAppointmentDetail(@Req() req, @Param('id') id: string) {
    return this.adminService.getAppointmentDetail(id);
  }

  @Delete('appointments/:id')
  async deleteAppointment(@Req() req, @Param('id') id: string) {
    return this.adminService.deleteAppointment(id);
  }
}
