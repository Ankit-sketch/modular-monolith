import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';

import { RegisterUserDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: RegisterUserDto) {
    return this.usersRepository.createUser(dto);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
  }
}
