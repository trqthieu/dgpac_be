// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request, Response } from 'express';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgotPasswordDto, LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Local registration
  @Post('local/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // Local login
  @Post('local/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }



  // Initiate Google OAuth flow
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {
    // This endpoint is handled by the guard (redirects to Google)
  }

  // Google OAuth redirect/callback endpoint


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateData: UpdateProfileDto) {
    return this.authService.updateProfile(req.user, updateData);
  }
}
