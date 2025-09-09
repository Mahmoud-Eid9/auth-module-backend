import { Injectable, Req } from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(private userSerivce: UserService){}
  getHello(user: any): string {
    return `Hello ${user.name}`;
  }
}
