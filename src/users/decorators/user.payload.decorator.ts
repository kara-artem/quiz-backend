import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserPayload = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
