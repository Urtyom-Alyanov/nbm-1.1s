import { Injectable, CanActivate, ExecutionContext, UseGuards, ContextType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      
      // required for passport.js for websocket grapqhl subscriptions
      if (ctx.websocketHeader?.connectionParams) {
        const websocketHeader = ctx.websocketHeader?.connectionParams || {};

        return { headers: { ...websocketHeader } };
      }

      return ctx.req;
    }
    return context.switchToHttp().getRequest();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new AuthenticationError('Авторизация не пройдена');
    }
    return user;
  }
}


@Injectable()
export class LevelGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const level = this.reflector.get<number>('levelAccess', context.getHandler());
    if (!level || level <= 1) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const {req} = ctx.getContext();
    return req.user.levelAccess >= level;
  }
}

import { SetMetadata } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-express';
import { applyDecorators } from '@nestjs/common';

export const ForAuth = (level: number=1) => applyDecorators(
    SetMetadata('levelAccess', level),
    UseGuards(JwtAuthGuard, LevelGuard)
  );
