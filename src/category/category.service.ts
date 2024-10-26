import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { User } from 'src/auth/entities/user.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const category = await this.categoryRepository.create({
      ...createCategoryDto,
      user: user,
    });

    await this.categoryRepository.save(category);

    return category;
  }

  async getCategoriesByUser(paginationDto: PaginationDto, user: User) {
    const { limit = 100, offset = 0 } = paginationDto;

    const categories = this.categoryRepository.find({
      where: {
        user: { id: user.id },
      },
      take: limit,
      skip: offset,
    });

    return categories;
  }

  async getCategoryById(id: number, user: User) {
    const category = await this.categoryRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!category) {
      throw new NotFoundException(`There is no category with id ${id}`);
    }

    return category;
  }
}
