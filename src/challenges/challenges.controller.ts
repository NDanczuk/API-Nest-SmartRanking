import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { Challenge } from './interfaces/challenges.interface'
import { ChallengesService } from './challenges.service'
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe'
import { UpdateChallengeDto } from './dto/update-challenge.dto'
import { SetMatchChallengeDto } from './dto/set-match-challenge.dto'

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

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto)
  }

  @Post('/:challenge/match/')
  async setMatchChallenge(
    @Body(ValidationPipe) setMatchChallengeDto: SetMatchChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.setMatchChallenge(
      _id,
      setMatchChallengeDto,
    )
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.deleteChallenge(_id)
  }
}
