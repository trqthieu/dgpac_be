import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

export enum IndustryEnum {
  ALL = 'all',
  CHEMICALS = 'chemicals',
  PHARMACEUTICALS = 'pharmaceuticals & healthcare',
  OIL_GAS = 'oil & gas',
  ELECTRONICS = 'electronics & semiconductors',
  DEFENSE = 'defense & military',
  ENERGY = 'energy & renewables',
  CONSUMER_GOODS = 'consumer goods',
  OTHERS = 'others',
}

export enum WorkEnum {
  ALL = 'all',
  PACKAGING = 'packaging',
  DECANTING = 'decanting',
  TRANSPORT = 'transport',
  WAREHOUSING = 'warehousing',
  TRAINING = 'training',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: IndustryEnum, required: true })
  industry: IndustryEnum;

  @Prop({ enum: WorkEnum, required: true })
  work: WorkEnum;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
