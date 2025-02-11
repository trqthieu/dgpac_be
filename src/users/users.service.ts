import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Appointment, AppointmentDocument, AppointmentStatus } from 'src/schemas/appointment.schema';
import { Chat, ChatDocument } from 'src/schemas/chat.schema';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const data = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
    return data;
  }

  // Create a new user
  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  // Find a user by ID
  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Find a user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Update user information
  async update(userId: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  // Get all users (for admin)
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Soft delete (block user)
  async blockUser(userId: string): Promise<User> {
    return this.update(userId, { isBlocked: true });
  }

  // Unblock user
  async unblockUser(userId: string): Promise<User> {
    return this.update(userId, { isBlocked: false });
  }

  async createFromGoogle(googleUser: any): Promise<UserDocument> {
    // Map fields from the Google user to your user schema.
    const createdUser = new this.userModel({
      email: googleUser.email,
      fullName: `${googleUser.firstName} ${googleUser.lastName}`,
      confirmed: true,
      provider: 'google',
      role: 'user',
      providerId: googleUser.providerId,
      passwordHash: '',
    });
    return createdUser.save();
  }

  async getProfile(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async bookAppointment(
    userId: string,
    dto: BookAppointmentDto,
  ): Promise<AppointmentDocument> {
    const appointmentData: Appointment = {
      userId: userId,
      serviceId: dto.serviceId,
      appointmentTime: new Date(dto.appointmentTime),
      status: AppointmentStatus.Pending,
    };
    // If the user selects a specific expert, set it; otherwise, leave undefined
    if (dto.expertId) {
      appointmentData.expertId = dto.expertId;
    }
    const appointment = new this.appointmentModel(appointmentData);
    const savedAppointment = await appointment.save();

    // If no expert was chosen, you could implement logic to notify all experts offering the service.
    // For example:
    // if (!dto.expertId) {
    //   await this.notifyExpertsAboutNewAppointment(dto.serviceId, savedAppointment._id);
    // }

    return savedAppointment;
  }

  async getAppointments(userId: string): Promise<AppointmentDocument[]> {
    return this.appointmentModel.find({ userId: userId }).exec();
  }

  async sendChatMessage(
    userId: string,
    dto: ChatMessageDto,
  ): Promise<ChatDocument> {
    const chat = new this.chatModel({
      userId: userId,
      message: dto.message,
      sender: 'user',
    });
    return chat.save();
  }

  async getChatHistory(userId: string): Promise<ChatDocument[]> {
    return this.chatModel.find({ userId: userId }).sort({ createdAt: -1 }).exec();
  }

  async postReview(userId: string, dto: ReviewDto): Promise<ReviewDocument> {
    const review = new this.reviewModel({
      userId: userId,
      expertId: dto.expertId,
      rating: dto.rating,
      comment: dto.comment,
    });
    return review.save();
  }
}
