
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { type } from 'os';
import { hash } from '../utils/crypto';



@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  email: string;

  @Prop()
  password: string;
  required: true;
  
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function(next) {
  hash(this.password).then(hashedPwd => {
    this.password = hashedPwd;
    next();
  });
});

export {UserSchema}