import { PickType } from '@nestjs/mapped-types';
import { CreateCommandDto } from './create-command.dto';

export class UpdateCommandDto extends PickType(CreateCommandDto, [
  'description',
  'advance',
]) {}
