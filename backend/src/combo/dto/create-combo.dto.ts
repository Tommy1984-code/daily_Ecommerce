import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class CreateComboLineDto {
  @ApiProperty()
  @IsString()
  navItemNo: string;

  @ApiProperty()
  @IsString()
  itemDescription: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  salesUom?: string;
}

export class CreateComboDto {
  @ApiProperty()
  @IsString()
  navItemNo: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ type: [CreateComboLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComboLineDto)
  lines: CreateComboLineDto[];
}
