import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()  
  readonly name: string;
  
  @ApiProperty()
  readonly email: string;
    
  @ApiProperty()
  readonly age: number;
  
  @ApiProperty()
  readonly password: string;
  }