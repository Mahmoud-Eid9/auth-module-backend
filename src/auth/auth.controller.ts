import { Controller, Post, Body, ValidationPipe, Res, Req, UnauthorizedException, Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { LoggerSerivce } from 'src/logger/logger.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import type { AuthRequest } from 'src/interface/auth-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly logger: LoggerSerivce) {}

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto): Promise<any> { 
    this.logger.log(`user hits regisers with the email: ${registerDto.email}`)
    return this.authService.register(registerDto);
  }

  @Post('login')
  async logIn(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<any> {
    this.logger.log(`user tries logging in with email: ${loginDto.email}`);
    const { accessToken, refreshToken } = await this.authService.logIn(loginDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,//in order to work on localhost
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return { accessToken };
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    this.logger.log(`user hits the route refersh with the refresh toknen (${refreshToken})`);
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const { newAccessToken, newRefreshToken } = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false, //in order to work on localhost
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return { newAccessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: AuthRequest){
    this.logger.log(`user with id ${req.user.sub} logged out`)
    return this.authService.logout(req.user);
  }
}
