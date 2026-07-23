import { IsArray, IsString, IsNumber, Min, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DeficiencyItemDto {
  @ApiProperty({ description: 'Order item ID' })
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'Quantity actually available in stock' })
  @IsNumber()
  @Min(0)
  quantityAvailable: number;
}

export class FlagDeficiencyDto {
  @ApiProperty({ type: [DeficiencyItemDto], description: 'Per-item available quantities' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DeficiencyItemDto)
  items: DeficiencyItemDto[];
}
