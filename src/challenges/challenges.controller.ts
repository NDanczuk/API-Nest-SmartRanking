import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { Challenge } from './interfaces/challenges.interface'
import { ChallengesService } from './challenges.service'

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name)

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(`createChallengeDto: ${JSON.stringify(createChallengeDto)}`)
    return await this.challengesService.createChallenge(createChallengeDto)
  }

  @Get()
  async getChallenges(
    @Query('playerId') _id: string,
  ): Promise<Array<Challenge>> {
    return _id
      ? await this.challengesService.getPlayerChallenges(_id)
      : await this.challengesService.getAllChallenges()
  }
}
