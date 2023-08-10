import { ApiProperty } from '@nestjs/swagger';
import { foreignProperty } from 'src/common/foreign.property';

export class CreateMessageDto {
  @ApiProperty()
  content: string;

  @ApiProperty(foreignProperty)
  creator: number;

  @ApiProperty(foreignProperty)
  recipient: number;
}
