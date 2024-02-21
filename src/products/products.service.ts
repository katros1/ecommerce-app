import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>, private readonly categoryService: CategoriesService){}

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity>  {


    const category = await this.categoryService.findOne(+createProductDto.category)
    const product = this.productRepository.create(createProductDto);
    // product.category = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const product =  await this.productRepository.findOne({
      where: {
        id:id
      },
      relations: {
        addedBy: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true
        }
      }
    });

    if(!product) {
      throw new NotFoundException('product not found')
    }

    return  product;
  }

  async update(id: number, updateProductDto: Partial<UpdateProductDto>, currentUser) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser;

    if(updateProductDto.category){
      const category = await this.categoryService.findOne(
        +updateProductDto.category,
      );
      // product.category= category;
    }
    return  await this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
