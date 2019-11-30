import { Request, Response } from 'express';

interface RadarrPayload {

  eventType: string;

  isUpgrade?: boolean;

  movie: {

    folderPath: string;

    id: number;

    releaseDate: string;

    title: string;
  }

  movieFile?: {

    id: number;

    path: string;

    quality: string;

    qualityVersion: number;

    relativePath: string;

    releaseGroup: string;

    sceneName: string;
  }

  release?: {

    quality: string;

    qualityVersion: number;

    releaseGroup: string;

    releaseTitle: string;

    indexer: string;

    size: number;
  }

  remoteMovie?: {

    imdbId: string;

    title: string;

    tmdbId: number;

    year: number;
  }
}

export default function (req: Request, res: Response) {

  const payload = req.body as RadarrPayload;
  const { eventType, movie } = payload;
  const { title } = movie;

  req.log.info({ payload: { ...payload, event: eventType.toLowerCase() } }, `Radarr ${eventType.toLowerCase()}: ${title}`);

  res.sendStatus(200);
}