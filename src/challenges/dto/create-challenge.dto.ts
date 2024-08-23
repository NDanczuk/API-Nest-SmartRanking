import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator'
import { Player } from 'src/players/interfaces/player.interface'

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateTimeChallenge: Date

  @IsNotEmpty()
  applicant: Player

  @IsNotEmpty()
  challenged: Player

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<Player>
}
