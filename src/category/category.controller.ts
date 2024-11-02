import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CategoryService } from './category.service';

import { User } from 'src/auth/entities/user.entity';

import { getUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { ModifyCategoryDto } from './dto/modify-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @Auth()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @getUser() user: User,
  ) {
    return this.categoryService.create(createCategoryDto, user);
  }

  @Get('')
  @Auth()
  getCategoriesByUser(
    @Query() getCategoriesDto: GetCategoriesDto,
    @getUser() user: User,
  ) {
    return this.categoryService.getCategoriesByUser(getCategoriesDto, user);
  }

  @Get(':id')
  @Auth()
  getCategoriesById(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: User,
  ) {
    return this.categoryService.getCategoryById(id, user);
  }

  @Put(':id')
  @Auth()
  modifyCategory(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: User,
    @Body() modifyCategoryDto: ModifyCategoryDto,
  ) {
    return this.categoryService.modifyCategory(id, modifyCategoryDto, user);
  }
}
