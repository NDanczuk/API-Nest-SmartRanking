import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Category } from './interfaces/category.interface'
import { CreateCategoryDto } from './dto/create-category.dto'
import { CategoriesService } from './categories.service'
import { UpdateCategoryDto } from './dto/update-category.sto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto)
  }

  @Get()
  async listCategories(): Promise<Array<Category>> {
    return await this.categoriesService.listAll()
  }

  @Get('/:category')
  async findById(@Param('category') category: string): Promise<Category> {
    return await this.categoriesService.findById(category)
  }

  @Delete('/:category')
  async deleteCategory(@Param('category') category: string): Promise<Category> {
    return await this.categoriesService.deleteCategory(category)
  }

  @Put('/:category')
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('category') category: string,
  ): Promise<Category> {
    return await this.categoriesService.updateCategory(
      category,
      updateCategoryDto,
    )
  }

  @Post('/:category/players/:playerId')
  async addPlayerCategory(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.addPlayerCategory(params)
  }
}
