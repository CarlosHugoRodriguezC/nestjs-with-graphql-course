import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from 'src/auth/dto/inputs/sign-up.input';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.userRepository.create(signUpInput);

      await this.userRepository.save(newUser);

      return newUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: number): Promise<User> {
    throw new Error('Method not implemented');
  }

  async update() {}

  block(id: number): Promise<User> {
    throw new Error('Blokc method not implemented');
  }
}
