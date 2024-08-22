import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePlayerDto } from './dto/create-player.dto'
import { Player } from './interfaces/player.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {
    console.log('Player model injected:', this.playerModel)
  }

  //Find all
  public async listPlayers(): Promise<Player[]> {
    return this.playerModel.find()
  }
  //Find by email
  async findByEmail(email: string): Promise<Player> {
    const user = await this.playerModel.findOne({ email })
    if (!user) {
      throw new NotFoundException('Email not found!')
    }
    return user
  }

  async deletePlayer(email: string): Promise<void> {
    return await this.playerModel.findOneAndDelete({ email })
  }

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto

    const foundPlayer = await this.playerModel.findOne({ email }).exec()

    if (foundPlayer) {
      await this.update(createPlayerDto)
    } else {
      await this.create(createPlayerDto)
    }
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto)
    return await createdPlayer.save()
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel.findOneAndUpdate(
      { email: createPlayerDto.email },
      { $set: createPlayerDto },
    )
  }
}
