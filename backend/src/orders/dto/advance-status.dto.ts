import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdvanceStatusDto {
  @ApiPropertyOptional({ description: 'Rider ID (required when advancing to Picked)' })
  @IsUUID()
  @IsOptional()
  riderId?: string;
}
