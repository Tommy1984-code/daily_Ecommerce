import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiPropertyOptional({ description: 'Item image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Specification in English' })
  @IsOptional()
  @IsString()
  specificationsEn?: string;

  @ApiPropertyOptional({ description: 'Specification in Amharic' })
  @IsOptional()
  @IsString()
  specificationsAm?: string;
}
