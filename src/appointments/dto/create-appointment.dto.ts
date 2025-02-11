import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  expertId?: string;

  @IsString()
  serviceId: string;

  @IsDateString()
  appointmentTime: string;
}
