import { createParamDecorator } from '@nestjs/common';

export const JwtPayload = createParamDecorator((data, req) => {
  return req.user;
});
