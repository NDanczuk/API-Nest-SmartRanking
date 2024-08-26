import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Challenge } from './interfaces/challenges.interface'
import { Model } from 'mongoose'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { PlayersService } from 'src/players/players.service'
import { CategoriesService } from 'src/categories/categories.service'
import { ChallengeStatus } from './interfaces/challenge-status.enum'

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name)

  // Create challenge
  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playersService.getAllPlayers()

    createChallengeDto.players.map(playersDto => {
      const playerFilter = players.filter(
        player => player._id == playersDto._id,
      )

      if (playerFilter.length == 0) {
        throw new BadRequestException(`Id ${playersDto._id} is not a player!`)
      }
    })

    const applicantIsMatchPlayer = await createChallengeDto.players.filter(
      player => player._id == createChallengeDto.applicant,
    )

    this.logger.log(`applicantIsMatchPlayer: ${applicantIsMatchPlayer}`)
    if (applicantIsMatchPlayer.length == 0) {
      throw new BadRequestException(`The applicant must be a match player!`)
    }

    const playerCategory = await this.categoriesService.getPlayerCategory(
      createChallengeDto.applicant,
    )

    if (!playerCategory) {
      throw new BadRequestException(
        `The applicant must be registered in a category!`,
      )
    }

    const createdChallenge = new this.challengeModel(createChallengeDto)
    createdChallenge.category = playerCategory.category
    createdChallenge.dateTimeSolicitation = new Date()
    createdChallenge.status = ChallengeStatus.PENDING
    this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`)
    return await createdChallenge.save()
  }

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec()
  }

  async getPlayerChallenges(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAllPlayers()

    const playerFilter = players.filter(player => player.id == _id)

    if (playerFilter.length == 0) {
      throw new BadRequestException(`ID ${_id} is not a player!`)
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec()
  }
}
