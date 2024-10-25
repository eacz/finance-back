import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

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
}
