import { ApiProperty } from '@nestjs/swagger';

export class RiderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() phone: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: string;
}
