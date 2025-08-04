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
    const createdProduct = new this.ProductModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(query: PaginationQueryDto) {
    const page = +query?.page || 1;
    const limit = +query?.limit || 1;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.ProductModel.find()
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.ProductModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const Product = await this.ProductModel.findById(id).exec();
    if (!Product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return Product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.ProductModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    ).exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<any> {
    const result = await this.ProductModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { message: 'Product deleted successfully' };
  }
}
