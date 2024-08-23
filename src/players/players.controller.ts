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
import { CreatePlayerDto } from './dto/create-player.dto'
import { UpdatePlayerDto } from './dto/update-player.dto'
import { PlayersService } from './players.service'
import { Player } from './interfaces/player.interface'
import { PlayersValidationParamsPipe } from '../shared/pipes/player-validation-params.pipe'

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers()
  }

  @Get('/:_id')
  async getPlayerById(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.getPlayerById(_id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto)
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.updatePlayer(_id, updatePlayerDto)
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<void> {
    return await this.playersService.deletePlayer(_id)
  }
}
