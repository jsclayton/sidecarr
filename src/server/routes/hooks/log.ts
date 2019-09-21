import { Request, Response } from 'express';

export default function (req: Request, res: Response) {

  const { body } = req;
  req.log.info({ body }, 'Webhook received');

  res.sendStatus(200);
}