import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO, CreateUserDto } from "./dto";
import * as argon from "argon2";
import { Prisma } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable({})
export class AuthService {

  constructor(private prisma: PrismaService, private config: ConfigService, private jwt: JwtService) {}

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

      return this.signToken(user.id, user.username);
    
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

    return this.signToken(userFetched.id, userFetched.username);
  }

  async signToken(userId: number, username: string): Promise<{ access_token: string}> {
    const payload = { sub: userId, username };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret
    })

    return { access_token: token }
  }
}