// auth.controller.ts
import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req,
    Res,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { ResetPasswordDto } from './dto/reset-password.dto';
  import { Request, Response } from 'express';
  import { GoogleOAuthGuard } from './google-oauth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgotPasswordDto, LoginDto } from './dto/login.dto';
  
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
  
    // Request password reset (forgot password)
    @Post('forgot-password')
    async forgotPassword(@Body() data: ForgotPasswordDto) {
      return this.authService.forgotPassword(data.email);
    }
  
    // Reset password (using token sent by email)
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetPassword(resetPasswordDto);
    }
  
    // Initiate Google OAuth flow
    @Get('google')
    @UseGuards(GoogleOAuthGuard)
    googleAuth() {
      // This endpoint is handled by the guard (redirects to Google)
    }
  
    // Google OAuth redirect/callback endpoint
    @Get('google/redirect')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
      const jwt = await this.authService.oAuthLogin(req.user);
      res.redirect(`http://your-frontend-url?token=${jwt.access_token}`);
    }
  }
  