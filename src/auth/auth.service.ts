import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO, CreateUserDto } from "./dto";
import * as argon from "argon2";
import { Prisma } from "@prisma/client";

@Injectable({})
export class AuthService {

  constructor(private prisma: PrismaService) {}

  async signup(dto: CreateUserDto) {
    console.log(dto);

    // here doing hash
    const passwordEncoded = await argon.hash(dto.password);
  
    try {
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
    
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials taken');
          }
        }
        throw error;
    }
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