import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from "./dto";
import { User } from '@prisma/client'

@Injectable({})
export class AuthService {

  constructor(private prisma: PrismaService) {}

  async signup() {
    const userJoseMaria = await this.prisma.user.create({
      data: {
        username: 'josemaria',
        hash: 'maria17'
      }
    });

    const userDaniel = await this.prisma.user.create({
      data: {
        username: 'daniel',
        hash: 'daniel17'
      }
    });

    const userCecilia = await this.prisma.user.create({
      data: {
        username: 'cecilia',
        hash: 'cecilia17'
      }
    });

    return [userJoseMaria, userDaniel, userCecilia];
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