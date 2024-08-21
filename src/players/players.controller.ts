import { Body, Controller, Post } from '@nestjs/common'
import { createPlayerDto } from './dto/create-player.dto'

@Controller('players')
export class PlayersController {
  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: createPlayerDto) {
    const { email } = createPlayerDto
    return JSON.stringify({
      email: `${email}`,
    })
  }
}
