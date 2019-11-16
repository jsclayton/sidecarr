import { Request, Response } from 'express';
import asyncHandler from '../../server/asyncHandler';
import fs from 'fs';
import got from 'got';
import path from 'path';
import sharp from 'sharp';

const MASK = sharp(fs.readFileSync(path.resolve(__dirname, './mask.svg')));

export default asyncHandler(async function (req: Request, res: Response) {

  const response = await got.get(req.query.url, { encoding: null });
  const avatar = sharp(response.body);

  const mask = await MASK.clone().resize(100, 100).toBuffer();

  const output = await avatar
    .resize(100, 100)
    .composite([
      { input: mask, blend: 'dest-in'}
    ])
    .png()
    .toBuffer();

  return res
    .set('cache-control', 'max-age=3600')
    .type('png')
    .send(output);
});
