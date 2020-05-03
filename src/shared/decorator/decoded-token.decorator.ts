import { createParamDecorator } from '@nestjs/common';

export const DecodedToken = createParamDecorator((data: string, req) => {
  return data ? req.decodedToken && req.decodedToken[data] : req.decodedToken;
});
