import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreatePlayerDto } from './dto/create-player.dto'
import { PlayersService } from './players.service'
import { Player } from './interfaces/player.interface'
import { PlayersValidationParamsPipe } from './pipes/player-validation-params.pipe'

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async listPlayers(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.findByEmail(email)
    } else {
      return await this.playersService.listPlayers()
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createUpdatePlayer(createPlayerDto)
  }

  @Delete()
  async deletePlayer(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<void> {
    this.playersService.deletePlayer(email)
  }
}
