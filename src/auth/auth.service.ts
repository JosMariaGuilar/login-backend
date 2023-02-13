import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO, CreateUserDto } from "./dto";
import * as argon from "argon2";
import { Prisma } from "@prisma/client";

@Injectable({})
export class AuthService {

  constructor(private prisma: PrismaService) {}

  async signup(dto: CreateUserDto) {
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
    // search user
    const userFetched = await this.prisma.user.findUnique({
      where: {
        username: dto.username
      },
    })
    
    // user not found
    if (!userFetched) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // comparing password
    const passwordMatches = await argon.verify(userFetched.hash, dto.password);
    
    // if password incorrect throw exception
    if (!passwordMatches) {
      throw new ForbiddenException('Password incorrect');
    }

    delete userFetched.hash;

    return userFetched;
  }
}