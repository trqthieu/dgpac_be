import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IndustryEnum, WorkEnum } from 'src/schemas/project.schema';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly image: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty({ enum: IndustryEnum })
  @IsEnum(IndustryEnum)
  readonly industry: IndustryEnum;

  @ApiProperty({ enum: WorkEnum })
  @IsEnum(WorkEnum)
  readonly work: WorkEnum;
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({ enum: IndustryEnum })
  @IsOptional()
  @IsEnum(IndustryEnum)
  readonly industry?: IndustryEnum;

  @ApiPropertyOptional({ enum: WorkEnum })
  @IsOptional()
  @IsEnum(WorkEnum)
  readonly work?: WorkEnum;
}
