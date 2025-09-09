import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/auth.guard';
import type { Request } from 'express';
import type { AuthRequest } from './interface/auth-request';
import { LoggerSerivce } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly logger: LoggerSerivce) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() req: AuthRequest): string {
    this.logger.log(`${req.user} calls getHello`);
    return this.appService.getHello(req.user);
  }
}
