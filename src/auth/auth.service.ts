import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO, CreateUserDto } from "./dto";
import * as argon from "argon2";

@Injectable({})
export class AuthService {

  constructor(private prisma: PrismaService) {}

  async signup(dto: CreateUserDto) {

    const passwordEncoded = await argon.hash(dto.password);
  
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        hash: passwordEncoded
      }
    });

    delete user.hash;

    return user;
  }

  async login(dto: AuthDTO) {
    const userFetched = await this.prisma.user.findFirst({
      where: {
        username: dto.username as string
      },
    })

    if (!userFetched) {
      throw new ForbiddenException('Credentials incorrect');
    }

    if (userFetched.hash !== dto.password) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return userFetched;
  }
}