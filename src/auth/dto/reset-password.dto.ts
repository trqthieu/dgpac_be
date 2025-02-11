import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsJWT()
  readonly resetToken: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  readonly newPassword: string;
}
