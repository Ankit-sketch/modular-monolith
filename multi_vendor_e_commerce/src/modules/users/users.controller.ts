import { Body, Controller, Get } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUser() {
    return 'helloworld';
  }
}
