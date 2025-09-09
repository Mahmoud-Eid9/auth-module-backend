import { Global, Module } from '@nestjs/common';
import { LoggerSerivce } from './logger.service';

@Global()
@Module({
  providers: [LoggerSerivce],
  exports: [LoggerSerivce]
})
export class LoggerModule {}
