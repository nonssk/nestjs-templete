import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop()
  public firstname!: string;
  @Prop()
  public surname!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
