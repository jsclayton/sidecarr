import asyncHandler from '../../../server/asyncHandler';
import { scanDirectory } from '../../../services/pms';
import { Request, Response } from 'express';

interface LidarrPayload {
  eventType: string;
  artist?: {
    name: string;
    path: string;
  }
}

export default asyncHandler(async function (req: Request, res: Response) {

  const payload = req.body as LidarrPayload;
  const { eventType, artist } = payload;
  if (!artist) {
    return res.sendStatus(200);
  }
  const { name, path } = artist;

  req.log.info({ payload: { ...payload, event: eventType.toLowerCase() } }, `Lidarr ${eventType.toLowerCase()}: ${name}`);

  if (['download', 'rename'].includes(eventType.toLowerCase())) {
    await scanDirectory(path);
  }

  res.sendStatus(200);
})