// src/users/users.controller.ts
import { Controller, Get, Put, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ReviewDto } from './dto/review.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get user profile
  @Get('profile')
  async getProfile(@Req() req) {
    console.log(req.user);
    
    return this.usersService.getProfile(req.user._id);
  }

  // Update user profile
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user._id, updateProfileDto);
  }

  // Book an appointment
  @Post('appointments')
  async bookAppointment(@Req() req, @Body() dto: BookAppointmentDto) {
    return this.usersService.bookAppointment(req.user._id, dto);
  }

  // Get appointment history
  @Get('appointments')
  async getAppointments(@Req() req) {
    return this.usersService.getAppointments(req.user.id);
  }

  // Chat endpoints: send message and get history
  @Post('chat')
  async sendChatMessage(@Req() req, @Body() dto: ChatMessageDto) {
    return this.usersService.sendChatMessage(req.user._id, dto);
  }

  @Get('chat')
  async getChatHistory(@Req() req) {
    return this.usersService.getChatHistory(req.user._id);
  }

  // Post review for expert
  @Post('reviews')
  async postReview(@Req() req, @Body() dto: ReviewDto) {
    return this.usersService.postReview(req.user._id, dto);
  }
}
