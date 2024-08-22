import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  readonly name: string
}
