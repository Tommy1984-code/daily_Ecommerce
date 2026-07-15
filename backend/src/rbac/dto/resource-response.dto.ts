import { ApiProperty } from '@nestjs/swagger';

export class ResourceResponseDto {
  @ApiProperty({ description: 'Resource unique identifier', example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ description: 'Resource name', example: 'orders' })
  name: string;

  @ApiProperty({ description: 'Resource description', example: 'orders management' })
  description: string;
}
