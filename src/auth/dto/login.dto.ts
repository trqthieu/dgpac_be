import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}



export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}