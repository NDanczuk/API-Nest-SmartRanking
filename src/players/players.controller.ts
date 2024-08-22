import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { CreatePlayerDto } from './dto/create-player.dto'
import { PlayersService } from './players.service'
import { IPlayer } from './interfaces/IPlayer.interface'

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async listPlayers(
    @Query('email') email: string,
  ): Promise<IPlayer[] | IPlayer> {
    if (email) {
      return await this.playersService.findByEmail(email)
    } else {
      return await this.playersService.listPlayers()
    }
  }

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createUpdatePlayer(createPlayerDto)
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    this.playersService.deletePlayer(email)
  }
}
