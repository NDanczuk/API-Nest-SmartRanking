import {
  Body,
  Controller,
  Logger,
  Param,
  Post,
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
}
