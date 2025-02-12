// src/blog/dto/blog.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateBlogDto {
    
  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly title: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(10)
  readonly content: string;
  
  @ApiProperty()
  @IsString()
  readonly author: string;
  
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly published?: boolean;
}

export class UpdateBlogDto {
    
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly title?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly content?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly author?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly published?: boolean;
}
