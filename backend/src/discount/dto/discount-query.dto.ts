import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../product/dto/pagination.dto';

export class DiscountQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search term for item title' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  q?: string;
}
