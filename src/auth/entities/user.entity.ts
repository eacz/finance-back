//import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Document } from 'mongoose';

//export type UserDocument = User & Document;

//@Schema({ timestamps: true })
//export class User {
//  @Prop({ type: String, unique: true, required: true })
//  username: string;

//  @Prop({ type: String, unique: true, required: true })
//  email: string;

//  @Prop({ type: String, required: true })
//  name: string;

//  @Prop({ type: String, required: true })
//  password: string;

//  @Prop({ type: Boolean, default: true })
//  active: boolean;

//  @Prop({ type: Date })
//  createdAt?: Date;

//  @Prop({ type: Date })
//  updatedAt?: Date;
//}

//export const userSchema = SchemaFactory.createForClass(User);
