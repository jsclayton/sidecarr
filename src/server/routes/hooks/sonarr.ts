import path from 'path';
import asyncHandler from '../../../server/asyncHandler';
import { scanDirectory } from '../../../services/pms';
import { Request, Response } from 'express';

interface SonarrPayload {
  eventType: string;
  series: {
    path: string;
    title: string;
  }
  episodes?: [{
    episodeNumber: number;
    seasonNumber: number;
    title: string;
  }]
  episodeFile?: {
    relativePath: string;
  }
}

export default asyncHandler(async function (req: Request, res: Response) {

  const payload = req.body as SonarrPayload;
  const { episodeFile, episodes, eventType, series } = payload;
  if (!series) {
    return res.sendStatus(200);
  }

  const { title } = series;
  const suffix = episodes ? ` ${episodes.map((ep) => `s${ep.seasonNumber.toString().padStart(2, '0')}e${ep.episodeNumber.toString().padStart(2, '0')}`).join(', ')}` : '';
  req.log.debug({ payload: { ...payload, event: eventType.toLowerCase() } }, `Sonarr ${eventType.toLowerCase()}: ${title}${suffix}`);

  if (eventType.toLowerCase() === 'download' && episodeFile) {
    await scanDirectory(path.dirname(path.join(series.path, episodeFile.relativePath)));
  }

  res.sendStatus(200);
})