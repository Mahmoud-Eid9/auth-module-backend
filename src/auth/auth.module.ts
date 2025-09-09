import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.schema';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    {
      provide: 'JWT_ACCESS_TOKEN_SERVICE',
      useFactory: (config: ConfigService) =>
        new JwtService({
          secret: config.get<string>('ACCESS_JWT_SECRET'),
          signOptions: { expiresIn: '10m' },
        }),
      inject: [ConfigService],
    },
    {
      provide: 'JWT_REFRESH_TOKEN_SERVICE',
      useFactory: (config: ConfigService) =>
        new JwtService({
          secret: config.get<string>('REFRESH_JWT_SECRET'),
          signOptions: { expiresIn: '7d' },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}