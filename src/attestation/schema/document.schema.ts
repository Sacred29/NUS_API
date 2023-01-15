
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type } from 'os';



@Schema()
export class Document {
  
  @Prop()
  institution: string;

  @Prop()
  dateTime: number;

  @Prop()
  claim: string;

  @Prop()
  valid: string;
  
  
}

const DocumentSchema = SchemaFactory.createForClass(Document);



export {DocumentSchema}