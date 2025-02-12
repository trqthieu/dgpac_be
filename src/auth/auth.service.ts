// auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mailer/mailer.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: NestJwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  // Local sign up: Create a new user and return a JWT
  async signUp(signUpDto: SignUpDto) {
    const existedUser = await this.usersService.findByEmail(signUpDto.email);
    if (existedUser) {
      throw new BadRequestException('User existed');
    }
    const passwordHash = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.usersService.create({ ...signUpDto, passwordHash });
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { user, accessToken: token };
  }

  // Local login: Validate credentials and return JWT
  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { user, accessToken: token };
  }

  // Google OAuth: Find or create user based on Google profile and return JWT
  async oAuthLogin(googleUser: any) {
    console.log(googleUser);

    let user = await this.usersService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.createFromGoogle(googleUser);
    }
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { user, accessToken: token };
  }

  // Forgot Password: Generate reset token and send email
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    // Generate a reset token (here we use JWT with a short expiry)
    const resetToken = this.jwtService.sign(
      { sub: user._id },
      { expiresIn: '15m', secret: process.env.JWT_RESET_SECRET },
    );
    await this.mailerService.sendResetPasswordEmail(user, resetToken);
    return { message: 'Password reset link sent to your email' };
  }

  // Reset Password: Verify token and update password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword } = resetPasswordDto;
    let payload: any;
    try {
      payload = this.jwtService.verify(resetToken, {
        secret: process.env.JWT_RESET_SECRET,
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Hash the new password and update user record
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user._id, user);
    return { message: 'Password reset successful' };
  }

  async getProfile(user: any): Promise<any> {
    const res = await this.usersService.findById(user._id);
    return res;
  }

  async updateProfile(user: any, updateData: UpdateProfileDto): Promise<any> {
    const updated = await this.usersService.updateProfile(user._id, updateData);
    return updated;
  }
}
