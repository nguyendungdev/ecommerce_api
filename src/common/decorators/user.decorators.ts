import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDeco = createParamDecorator((data, req) => {
  return req.user;
});
