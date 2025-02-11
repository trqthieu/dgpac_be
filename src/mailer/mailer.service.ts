// mailer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendResetPasswordEmail(user: any, resetToken: string) {
    const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset your password',
      text: `Hi ${user.name}, click on the following link to reset your password: ${resetLink}`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Reset password email sent to ${user.email}`);
    } catch (error) {
      this.logger.error('Error sending reset password email', error);
      throw error;
    }
  }
}
