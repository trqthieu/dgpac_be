// src/blog/dto/blog.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly link: string;

  // @ApiProperty()
  // @IsString()
  // readonly description: string;

  @ApiProperty()
  @IsString()
  readonly tag: string;
}

export class UpdateBlogDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly link?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly tag?: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // readonly description?: string;
}
