import { Request, Response } from 'express';
import multer from 'multer';

const upload = multer();

export default [upload.single('thumb'), function (req: Request, res: Response) {

  const { body } = req;
  const payload = JSON.parse(body.payload);
  req.log.info({ payload }, 'Webhook received');

  res.sendStatus(200);
}]