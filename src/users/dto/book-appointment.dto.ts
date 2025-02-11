// src/users/dto/book-appointment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class BookAppointmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceId: string; // ID of the service to book

  // Optional: if user selects a specific expert
  @ApiProperty()
  @IsOptional()
  @IsString()
  expertId?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  appointmentTime: string; // ISO formatted date string
}
