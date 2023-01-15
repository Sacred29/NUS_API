
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type } from 'os';



@Schema()
export class Document {
  
  @Prop()
  wrappedDoc: string;

  @Prop()
  docRoot: string;
  
  
}

const DocumentSchema = SchemaFactory.createForClass(Document);



export {DocumentSchema}