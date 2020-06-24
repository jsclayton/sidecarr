import { Request, Response } from 'express';
import asyncHandler from '../../server/asyncHandler';
import fs from 'fs';
import got from 'got';
import path from 'path';
import sharp from 'sharp';

const MASK = sharp(Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 100 100">
    <circle r="50" cx="50" cy="50"/>
</svg>`));

export default asyncHandler(async function (req: Request, res: Response) {

  const url = req.query.url as string;
  const response = await got.get(url).buffer();
  const avatar = sharp(response);

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
