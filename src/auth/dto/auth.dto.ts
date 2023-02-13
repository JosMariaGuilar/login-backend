import { IsNotEmpty, IsString } from "class-validator"

export class AuthDTO {

  @IsNotEmpty()
  username: String;

  @IsString()
  @IsNotEmpty()
  password: String;
}