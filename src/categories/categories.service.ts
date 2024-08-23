import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from './interfaces/category.interface'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.sto'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  // Create category
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto

    const foundCategory = await this.categoryModel.findOne({ category }).exec()

    if (foundCategory) {
      throw new BadRequestException(`Category ${category} already created!`)
    }

    const createdCategory = new this.categoryModel(createCategoryDto)
    return await createdCategory.save()
  }

  // Get all
  async listAll(): Promise<Array<Category>> {
    return await this.categoryModel.find().exec()
  }

  // Find one
  async findById(category: string): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({ category }).exec()

    if (!foundCategory) {
      throw new NotFoundException(`Category ${category} not found!`)
    }

    return foundCategory
  }

  // Update
  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({ category }).exec()

    if (!foundCategory) {
      throw new NotFoundException(`Category ${category} not found!`)
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec()

    const updatedCategory = await this.categoryModel
      .findOne({ category })
      .exec()

    return updatedCategory
  }

  //Delete
  async deleteCategory(category): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({ category }).exec()

    if (!foundCategory) {
      throw new NotFoundException(`Category ${category} not found!`)
    }

    await foundCategory.deleteOne()

    return foundCategory
  }
}
