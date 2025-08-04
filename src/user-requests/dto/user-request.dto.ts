import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly companyName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly phone: string;

  @ApiProperty()
  @IsString()
  readonly location: string;

  @ApiProperty()
  @IsString()
  readonly request: string;

  @ApiProperty()
  @IsString()
  readonly safetyDataSheet: string;

  @ApiProperty()
  @IsString()
  readonly packingList: string;
}

export class UpdateUserRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly request?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly safetyDataSheet?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly packingList?: string;
}
