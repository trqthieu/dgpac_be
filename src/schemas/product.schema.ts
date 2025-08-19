import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  title: string;

  @Prop()
  slug: string;

  @Prop()
  content: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop()
  linkSharepoint: string;

  @Prop()
  range: string[];

  @Prop()
  position: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
