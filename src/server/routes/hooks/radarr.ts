import asyncHandler from '../../../server/asyncHandler';
import { scanDirectory } from '../../../services/pms';
import { Request, Response } from 'express';

interface RadarrPayload {
  eventType: string;
  movie: {
    folderPath: string;
    title: string;
  }
}

export default asyncHandler(async function (req: Request, res: Response) {

  const payload = req.body as RadarrPayload;
  const { eventType, movie } = payload;
  if (!movie) {
    return res.sendStatus(200);
  }
  const { title } = movie;
  req.log.debug({ payload: { ...payload, event: eventType.toLowerCase() } }, `Radarr ${eventType.toLowerCase()}: ${title}`);

  if (eventType.toLowerCase() === 'download') {
    await scanDirectory(movie.folderPath);
  }

  res.sendStatus(200);
})