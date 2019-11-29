import { Request, Response } from 'express';

interface SonarrPayload {

  eventType: string;

  isUpgrade?: boolean;

  series: {

    id: number;

    path: string;

    title: string;

    tvdbId: number;
  }

  episodes?: [{

    id: number;

    episodeNumber: number;

    seasonNumber: number;

    title: string;

    airDate: string;

    airDateUtc: string;

    quality: string;

    qualityVersion: number;
  }]

  episodeFile?: {

    id: number;

    relativePath: string;

    path: string;

    quality: string;

    qualityVersion: number;
  }

  release?: {

    quality: string;

    qualityVersion: string;

    size: number;
  }
}

export default function (req: Request, res: Response) {

  const payload = req.body as SonarrPayload;
  const { episodes, eventType, series } = payload;
  const { title } = series;
  const suffix = episodes ? ` ${episodes.map((ep) => `s${ep.seasonNumber.toString().padStart(2, '0')}e${ep.episodeNumber.toString().padStart(2, '0')}`).join(', ')}` : '';

  req.log.info({ payload, event: eventType }, `Sonarr ${eventType.toLowerCase()}: ${title}${suffix}`);

  res.sendStatus(200);
}