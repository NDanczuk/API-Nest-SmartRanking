import { Injectable, Logger } from '@nestjs/common'
import { CreatePlayerDto } from './dto/create-player.dto'
import { IPlayer } from './interfaces/IPlayer.interface'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PlayersService {
  private players: IPlayer[] = []

  private readonly logger = new Logger(PlayersService.name)

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`createPlayerDto: ${createPlayerDto}`)
    await this.create(createPlayerDto)
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
}
