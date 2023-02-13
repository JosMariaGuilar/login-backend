import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO, CreateUserDto } from './dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDTO) {
    return this.authService.login(dto);
  }
}