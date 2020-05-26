import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export function CommonHeaderReceiptDecorator() {
  return applyDecorators(
    ApiHeader({
      name: 'request-id',
      description:
        'Definition of the requestId header A unique request ID, represented by a UUID.',
      required: false,
      allowEmptyValue: true,
      example: uuidv4(),
      schema: {
        default: uuidv4(),
      },
    }),
  );
}
