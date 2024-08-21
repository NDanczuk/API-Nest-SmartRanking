import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PlayersModule } from './players/players.module'
import { PlayersController } from './players/players.controller'
@Module({
  imports: [PlayersModule],
  controllers: [AppController, PlayersController],
  providers: [AppService],
})
export class AppModule {}
