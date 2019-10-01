import { NextFunction, Request, RequestHandler, Response } from 'express';

export default function asyncHandler (func: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = func.call(undefined, req, res, next);
    return result && result.catch ? result.catch(next) : result;
  }
}
