import { IsNotEmpty } from 'class-validator'
import { Player } from 'src/players/interfaces/player.interface'
import { Result } from '../interfaces/result.interface'

export class SetMatchChallengeDto {
  @IsNotEmpty()
  def: Player

  @IsNotEmpty()
  result: Array<Result>
}
