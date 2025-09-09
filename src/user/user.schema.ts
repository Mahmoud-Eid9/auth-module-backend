
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true})
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true})
  password: string;

  @Prop({ default: 0 })
  jwtVersion: number;
}

export const userSchema = SchemaFactory.createForClass(User);
