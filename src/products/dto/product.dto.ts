import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  readonly content: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsString()
  readonly image: string;

  @ApiProperty()
  @IsString({ each: true })
  readonly range: string[];

  @ApiProperty()
  @IsNumber()
  readonly position: number;
}

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly content?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  readonly range: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly position: number;
}
