import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { PaginationDto } from '../../product/dto/pagination.dto';

export class PriceQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by item title' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  q?: string;
}
