// dto/sign-up.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  readonly fullName: string;
  
  @ApiProperty()
  @IsEmail()
  readonly email: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly address?: string;
}

