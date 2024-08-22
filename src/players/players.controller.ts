import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreatePlayerDto } from './dto/create-player.dto'
import { PlayersService } from './players.service'
import { IPlayer } from './interfaces/IPlayer.interface'

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async listPlayers(): Promise<IPlayer[]> {
    return this.playersService.listPlayers()
  }

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createUpdatePlayer(createPlayerDto)
  }
}
