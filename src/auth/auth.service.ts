import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshDto } from './dto/refresh.dto';
import { LoggerSerivce } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(@Inject('JWT_ACCESS_TOKEN_SERVICE') private accessJwtService: JwtService,
    @Inject('JWT_REFRESH_TOKEN_SERVICE') private refreshJwtService: JwtService, private userService: UserService,
  private readonly logger: LoggerSerivce) { }

  async register(registerDto: RegisterDto) {
    const createUserDto: CreateUserDto = { ...registerDto };
    return this.userService.create(createUserDto);
  }

  async logIn(loginDto: LoginDto) {
     const user = await this.userService.verifyUser(loginDto);
     const accessToken = await this.generateToken(user._id.toString(), user.name);
     const refreshToken = await this.generateRefreshToken(user._id.toString(), user.jwtVersion);
     return {accessToken, refreshToken};
  }


  async refresh(refreshToken: string) {
    let payload: any
    try {
      payload = await this.refreshJwtService.verifyAsync(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Bad refresh token');
    }
    const user = await this.userService.getUserById(payload.sub);
    console.log(user.jwtVersion + "  " + payload.version);
    if(user.jwtVersion != payload.version){
      throw new UnauthorizedException('Expired Token')
    }
    user.jwtVersion++;
    user.save();
    const newAccessToken = await this.generateToken(user._id.toString(), user.name);
    const newRefreshToken = await this.generateRefreshToken(user._id.toString(), user.jwtVersion);

    return {newAccessToken, newRefreshToken};
  }


    async verifyAccessToken(token: string) {
    try {
      return this.accessJwtService.verify(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async logout(user: any){
    const tempUser = await this.userService.getUserById(user.sub);
    tempUser.jwtVersion++;
    tempUser.save();
    return;
  }

  async generateToken(id: string, name: string) {
    this.logger.log(`access token issued for user ${id}`)
    return await this.accessJwtService.signAsync({ sub: id, name });
  }

  async generateRefreshToken(id: string, version: number) {
    this.logger.log(`refresh token issued for user ${id} with version ${version}`)
    return await this.refreshJwtService.signAsync({ sub: id, version });
  }

}
