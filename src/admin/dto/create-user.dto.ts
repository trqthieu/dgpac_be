// src/admin/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  readonly fullName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;

  @ApiProperty()
  @IsString()
  readonly role: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly address: string;
}
