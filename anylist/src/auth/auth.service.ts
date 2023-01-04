import * as bcrypt from 'bcrypt';

import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { LoginInput, SignUpInput } from './dto/inputs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);
    const token = '123';

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);
    const token = '123';

    if (!bcrypt.compareSync(loginInput.password, user.password))
      throw new Error('invalid credentials');

    return {
      token,
      user,
    };
  }
}
