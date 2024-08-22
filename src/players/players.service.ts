import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePlayerDto } from './dto/create-player.dto'
import { IPlayer } from './interfaces/IPlayer.interface'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PlayersService {
  private players: IPlayer[] = []

  private readonly logger = new Logger(PlayersService.name)

  async listPlayers(): Promise<IPlayer[]> {
    return await this.players
  }

  async findByEmail(email: string): Promise<IPlayer> {
    const foundPlayer = await this.players.find(
      player => player.email === email,
    )
    if (!foundPlayer) {
      throw new NotFoundException(`Player with email: ${email} was not found!`)
    }
    return foundPlayer
  }

  async deletePlayer(email: string): Promise<void> {
    const foundPlayer = await this.players.find(
      player => player.email === email,
    )
    this.players = this.players.filter(
      player => player.email !== foundPlayer.email,
    )
  }

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto

    const foundPlayer = await this.players.find(
      player => player.email === email,
    )

    if (foundPlayer) {
      await this.update(foundPlayer, createPlayerDto)
    } else {
      await this.create(createPlayerDto)
    }
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, phoneNumber, email } = createPlayerDto

    const player: IPlayer = {
      _id: uuidv4(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      rankingPosition: 1,
      urlPlayerAvatar: 'www.google.com/image123.jpg',
    }
    this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`)
    this.players.push(player)
  }

  private update(foundPlayer: IPlayer, createPlayerDto: CreatePlayerDto) {
    const { name } = createPlayerDto
    foundPlayer.name = name
  }
}
