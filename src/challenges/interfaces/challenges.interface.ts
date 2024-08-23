import { Document } from 'mongoose'
import { Player } from 'src/players/interfaces/player.interface'

import { ChallengeStatus } from './challenge-status.enum'
import { Match } from './match.interface'

export interface Challenge extends Document {
  dateTimeChallenge: Date
  status: ChallengeStatus
  dateTimeSolicitation: Date
  dateTimeAnswer: Date
  applicant: Player
  challenged: Player
  category: string
  players: Array<Player>
  match: Match
}
