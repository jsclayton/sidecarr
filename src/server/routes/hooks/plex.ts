import { NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';

const upload = multer();

export default [
  upload.single('thumb'),
  function (req: Request, res: Response) {

    const { body } = req;
    let { payload } = body;
    if (!payload) {
      return res.sendStatus(200);
    }
    payload = JSON.parse(payload);

    req.log.info({ payload }, 'Webhook received');

    res.sendStatus(200);
  },
  function (err: any, req: Request, res: Response, next: NextFunction) {

    req.log.error(err);
    return res.sendStatus(200);
  }];