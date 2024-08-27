import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { UpdateChallengeDto } from './dto/update-challenge.dto'
import { SetMatchChallengeDto } from './dto/set-match-challenge.dto'
import { Match } from './interfaces/match.interface'

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match')
    private readonly matchModel: Model<Match>,
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

  // Get challenges
  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec()
  }

  // Get challenges
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

  // Update challenge
  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) {
      throw new NotFoundException(`Challenge ${_id} not found!`)
    }

    if (updateChallengeDto.status) {
      foundChallenge.dateTimeAnswer = new Date()
    }
    foundChallenge.status = updateChallengeDto.status
    foundChallenge.dateTimeAnswer = updateChallengeDto.dateTimeChallenge

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: foundChallenge })
      .exec()
  }

  // Set match to challenge
  async setMatchChallenge(
    _id: string,
    setMatchChallengeDto: SetMatchChallengeDto,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not found!`)
    }

    const playerFilter = foundChallenge.players.filter(
      player => player._id == setMatchChallengeDto,
    )

    this.logger.log(`foundChallenge: ${foundChallenge}`)
    this.logger.log(`playerFilter: ${playerFilter}`)

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `Winner player is not a part of the challenge!`,
      )
    }

    const createdMatch = new this.matchModel(setMatchChallengeDto)

    createdMatch.category = foundChallenge.category
    const result = await createdMatch.save()

    foundChallenge.status = ChallengeStatus.DONE

    foundChallenge.match = result.id

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: foundChallenge })
        .exec()
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec()
      throw new InternalServerErrorException()
    }
  }

  // Delete challenge
  async deleteChallenge(_id: string): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec()

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not found!`)
    }

    foundChallenge.status = ChallengeStatus.CANCELED

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: foundChallenge })
      .exec()
  }
}
