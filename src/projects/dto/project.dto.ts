import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/config/dto/pagination';
import { IndustryEnum, WorkEnum } from 'src/schemas/project.schema';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: IndustryEnum })
  @IsEnum(IndustryEnum)
  industry: IndustryEnum;

  @ApiProperty({ enum: WorkEnum })
  @IsEnum(WorkEnum)
  work: WorkEnum;
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: IndustryEnum })
  @IsOptional()
  @IsEnum(IndustryEnum)
  industry?: IndustryEnum;

  @ApiPropertyOptional({ enum: WorkEnum })
  @IsOptional()
  @IsEnum(WorkEnum)
  work?: WorkEnum;
}

export class ProjectFilterQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by industries',
    isArray: true,
    enum: IndustryEnum,
    example: [IndustryEnum.CHEMICALS, IndustryEnum.ENERGY],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  industries?: string[];

  @ApiPropertyOptional({
    description: 'Filter by works',
    isArray: true,
    enum: WorkEnum,
    example: [WorkEnum.PACKAGING, WorkEnum.TRANSPORT],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  works?: string[];
}
