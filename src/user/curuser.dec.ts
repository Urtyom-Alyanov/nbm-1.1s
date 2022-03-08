import { ContextType, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      
      // required for passport.js for websocket grapqhl subscriptions
      if (ctx.websocketHeader?.connectionParams) {
        return ctx.user;
      }

      return ctx.req.user;
    }
    return context.switchToHttp().getRequest().user;
  },
);