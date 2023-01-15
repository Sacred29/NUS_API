import { ApiProperty } from '@nestjs/swagger';

export class ClaimDto {
  
  @ApiProperty()
  readonly amount: number;
  @ApiProperty()
  readonly Id: string;
  @ApiProperty()
  readonly issueDate: number;
  @ApiProperty()
  readonly expiryDate: number;
  @ApiProperty()
  readonly BankName: string;
  @ApiProperty()
  readonly status: string;
  }