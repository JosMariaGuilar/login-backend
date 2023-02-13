import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}