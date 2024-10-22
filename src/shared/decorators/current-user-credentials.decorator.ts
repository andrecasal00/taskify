import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserCredentials = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user['refreshToken'];
  },
);
