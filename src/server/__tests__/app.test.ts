import app from '../app';
import request from 'supertest';

describe('app', () => {

  test('it works', async () => {

    await request(app)
      .post('/hooks/plex')
      .expect(200);

    await request(app)
      .post('/hooks/sonarr')
      .expect(200);

    await request(app)
      .post('/hooks/radarr')
      .expect(200);
  });
});