import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreatePlayerDto } from './dto/create-player.dto'
import { Player } from './interfaces/player.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdatePlayerDto } from './dto/update-player.dto'

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  //Find all
  public async getAllPlayers(): Promise<Player[]> {
    return this.playerModel.find()
  }
  //Find by email
  async getPlayerById(_id): Promise<Player> {
    const user = await this.playerModel.findOne({ _id })
    if (!user) {
      throw new NotFoundException('Player not found!')
    }
    return user
  }

  //Delete
  async deletePlayer(_id): Promise<void> {
    const foundPlayer = await this.playerModel.findOne({ _id }).exec()

    if (!foundPlayer) {
      throw new NotFoundException('Player not found')
    }

    await foundPlayer.deleteOne()
  }

  // Create player
  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto

    const foundPlayer = await this.playerModel.findOne({ email }).exec()

    if (foundPlayer) {
      throw new BadRequestException(`Email address (${email}) already in use!`)
    }

    const createdPlayer = new this.playerModel(createPlayerDto)
    return await createdPlayer.save()
  }

  // Update player
  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const foundPlayer = await this.playerModel.findOne({ _id }).exec()

    if (!foundPlayer) {
      throw new NotFoundException(`Player with ID ${_id} not found`)
    }

    return await this.playerModel.findOneAndUpdate(
      { _id },
      { $set: updatePlayerDto },
    )
  }
}
