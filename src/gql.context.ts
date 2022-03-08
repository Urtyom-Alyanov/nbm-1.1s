export interface GqlContext {
    req: Request;
    res: Response;
    payload?: any;
    connection: any;
  }