import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerSerivce extends Logger {
  private logFile = path.join(__dirname, '../../logs/app.log');

  private writeToFile(level: string, message: string) {
    const logMessage = `[${level}] ${new Date().toISOString()} - ${message}\n`;
    fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
    fs.appendFileSync(this.logFile, logMessage);
  }

  log(message: string) {
    super.log(message);
    this.writeToFile('LOG', message);
  }

  error(message: string, trace?: string) {
    super.error(message, trace);
    this.writeToFile('ERROR', message);
  }
}
