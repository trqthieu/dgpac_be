// src/blog/schemas/blog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  title: string;

  @Prop()
  link: string;

  // @Prop()
  // tag: string;

  @Prop()
  description: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
