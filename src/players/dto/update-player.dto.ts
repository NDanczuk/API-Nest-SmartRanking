import { IsOptional, IsString } from 'class-validator'
export class UpdatePlayerDto {
  @IsString()
  @IsOptional()
  readonly phoneNumber: string

  @IsString()
  @IsOptional()
  readonly name: string
}
