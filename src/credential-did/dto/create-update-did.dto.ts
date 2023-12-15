import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateDIDDto {
  @ApiProperty({ required: false, description: 'Author DID' })
  @IsString()
  @IsNotEmpty()
  authorDid: string;

  @ApiProperty({ required: false, description: 'Schema DID' })
  @IsString()
  @IsNotEmpty()
  schemaDid: string;

  @ApiProperty({ required: false, description: 'Schema DID' })
  @IsString()
  @IsNotEmpty()
  schemaVersion: string;
}