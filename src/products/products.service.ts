import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationQueryDto } from 'src/config/dto/pagination';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    createProductDto.slug = createProductDto.slug
      ? this.formatSlug(createProductDto.slug)
      : this.formatSlug(createProductDto.title);
    const createdProduct = new this.ProductModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(query: PaginationQueryDto) {
    const page = +query?.page || 1;
    const limit = +query?.limit || 10;
    const skip = (page - 1) * limit;

    const searchQuery = query.search
      ? { title: { $regex: query.search, $options: 'i' } }
      : {};

    const [data, total] = await Promise.all([
      this.ProductModel.find(searchQuery)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.ProductModel.countDocuments(searchQuery),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

   async findOne(id: string): Promise<Product> {
      let product = null
      const productWithSlug = await this.ProductModel.findOne({ slug: id });
      if(productWithSlug){
        product = productWithSlug;
      } else{
        const productWithId = await this.ProductModel.findById(id);
        product = productWithId;
      }
      if (!product)
        throw new NotFoundException(`Product with id ${id} not found`);
      return product;
    }

  // async update(
  //   id: string,
  //   updateProductDto: UpdateProductDto,
  // ): Promise<Product> {
  //   const updatedProduct = await this.ProductModel.findByIdAndUpdate(
  //     id,
  //     updateProductDto,
  //     { new: true },
  //   ).exec();
  //   if (!updatedProduct) {
  //     throw new NotFoundException(`Product with id ${id} not found`);
  //   }
  //   return updatedProduct;
  // }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
      const existingProduct = await this.ProductModel.findById(id);
      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      if (dto.slug || dto.title) {
        dto.slug = dto.slug ? this.formatSlug(dto.slug) : this.formatSlug(dto.title);
      }
      const updated = await this.ProductModel.findByIdAndUpdate(id, dto, {
        new: true,
      }).exec();
      if (!updated) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return updated;
    }

  async remove(id: string): Promise<any> {
    const result = await this.ProductModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { message: 'Product deleted successfully' };
  }

  private formatSlug(value: string): string {
    return value
      ? value
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // spaces to hyphen
          .replace(/-+/g, '-') // collapse multiple hyphens
      : value;
  }
}
