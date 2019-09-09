import { Request, Response } from 'express';

export default function (req: Request, res: Response) {

  req.log.info(req.body);

  res.sendStatus(200);
}