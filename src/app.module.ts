import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PlayersModule } from './players/players.module'
import { MongooseModule } from '@nestjs/mongoose'
@Module({
  imports: [PlayersModule, MongooseModule.forRoot(process.env.MONGO_URI)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
