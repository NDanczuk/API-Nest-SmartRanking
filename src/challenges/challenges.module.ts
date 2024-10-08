import { Module } from '@nestjs/common'
import { ChallengesService } from './challenges.service'
import { ChallengesController } from './challenges.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ChallengeSchema } from './interfaces/challenges.schema'
import { PlayersModule } from 'src/players/players.module'
import { CategoriesModule } from 'src/categories/categories.module'
import { MatchSchema } from './interfaces/match.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Challenge',
        schema: ChallengeSchema,
      },
      {
        name: 'Match',
        schema: MatchSchema,
      },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
