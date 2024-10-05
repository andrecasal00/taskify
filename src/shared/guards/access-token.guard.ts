import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { TokenExpiredError } from '@nestjs/jwt';
  import { AuthGuard } from '@nestjs/passport';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
      super();
    }
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const isPublic = this.reflector.getAllAndOverride('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (isPublic) return true;
      return super.canActivate(context);
    }
  
    handleRequest(err, user, info: Error) {
      console.log(user)
      if (info instanceof TokenExpiredError) {
        // do stuff when token is expired
        console.log('token expired');
  
        throw new ForbiddenException('Access Denied - Token Expired');
      }
      return user;
    }
  }