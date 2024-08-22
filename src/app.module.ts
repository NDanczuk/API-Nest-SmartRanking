import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PlayersModule } from './players/players.module'
import { PlayersController } from './players/players.controller'
import { PlayersService } from './players/players.service'
import { MongooseModule } from '@nestjs/mongoose'
@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot(
      'mongodb+srv://nicolasdanc3:banana32@cluster0.jqth8ro.mongodb.net/smartranking?retryWrites=true&w=majority',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
