import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function CommonResponseReceiptDecorator() {
  return applyDecorators(
    ApiBadRequestResponse({
      description:
        'The server cannot or will not process the request due to an apparent client error',
    }),
    ApiUnauthorizedResponse({
      description:
        'The request requires user authentication or, if the request included authorization credentials, authorization has been refused for those credentials.',
    }),
    ApiForbiddenResponse({
      description:
        'The server understood the request, but is refusing to fulfill it.',
    }),
    ApiNotFoundResponse({
      description: 'The specified resource was not found',
    }),
    ApiBadGatewayResponse({
      description:
        'The server was acting as a gateway or proxy and received an invalid response from the upstream server',
    }),
  );
}
