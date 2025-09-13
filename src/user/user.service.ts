import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { VerifyUserDto } from './dto/verify-user.dto';
import { LoggerSerivce } from 'src/logger/logger.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly logger: LoggerSerivce) { }

    salt = 10;

    async create(userDto: CreateUserDto): Promise<User> {
        const oldUser = await this.userModel.findOne({email: userDto.email }).exec();
        if(oldUser){
            this.logger.error(`email ${userDto.email} already exists`);
            throw new ConflictException('An accout with this email already exists')
        }
        const hashedPassword = await bcrypt.hash(userDto.password, this.salt);
        userDto.password = hashedPassword;
        const newUser = new this.userModel(userDto);
        this.logger.log(`User Created Successfully with email: ${userDto.email}`)
        return newUser.save();
    }

    async getUserById(id: string): Promise<UserDocument>{
        const user = await this.userModel.findById(id);
        if(user === null){
            this.logger.error(`a User does not exist with the id: ${id}`)
            throw new UnauthorizedException('User does not exist');
        }
        this.logger.log(`User ${user.email} fetched successfully`)
        return user;
    }


    async verifyUser(verifyUserDto: VerifyUserDto): Promise<UserDocument>{
        const user: UserDocument | null = await this.userModel.findOne({ email: verifyUserDto.email }).exec();
        if(user === null){
            this.logger.log(`Invalid Email and password provided with email ${verifyUserDto.email}`)
            throw new UnauthorizedException("Invalid Email and password")
        } 
        const comparison = await bcrypt.compare(verifyUserDto.password, user.password);
        if (!comparison) throw new UnauthorizedException("Invalid Email and password");
        this.logger.log(`user logging in with email: ${verifyUserDto.email}`);
        return user;
    }
}
