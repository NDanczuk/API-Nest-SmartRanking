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
import { PlayersService } from 'src/players/players.service'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
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
    return await this.categoryModel.find().populate('players').exec()
  }

  // Find one
  async findById(category: string): Promise<Category> {
    const foundCategory = await this.categoryModel
      .findOne({ category })
      .populate('players')
      .exec()

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

  // Add player to category
  async addPlayerCategory(params: string[]): Promise<void> {
    const category = params['category']
    const playerId = params['playerId']

    const foundCategory = await this.categoryModel.findOne({ category }).exec()
    const playerAlreadyInCategory = await this.categoryModel
      .find({ category })
      .where('players')
      .in(playerId)
      .exec()

    await this.playersService.getPlayerById(playerId)

    if (!foundCategory) {
      throw new BadRequestException(`Category ${category} does not exists!`)
    }

    if (playerAlreadyInCategory.length > 0) {
      throw new BadRequestException(
        `Player ${playerId} already in category ${category}`,
      )
    }

    foundCategory.players.push(playerId)
    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: foundCategory })
      .exec()
  }
}
