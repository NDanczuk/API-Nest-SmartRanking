import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PlayersModule } from './players/players.module'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoriesModule } from './categories/categories.module'
import { ChallengesModule } from './challenges/challenges.module';
@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    CategoriesModule,
    ChallengesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
