import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {

  signup() {
    return { msg: 'signup from service' }
  }

  login() {
    return { msg: 'signin from service' }
  }
}