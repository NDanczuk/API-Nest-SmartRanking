import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ChallengeStatus } from '../interfaces/challenge-status.enum'

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DECLINED,
    ChallengeStatus.CANCELED,
  ]

  transform(value: any) {
    const status = value.status.toUpperCase()

    if (!this.IsValidStatus(status)) {
      throw new BadRequestException(`${status} is not a valid status`)
    }

    return value
  }

  private IsValidStatus(status: any) {
    const idx = this.allowedStatus.indexOf(status)
    return idx !== -1
  }
}
