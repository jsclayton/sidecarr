import config from '../config';
import logger from '../log';
import got from 'got';

const log = logger.child({
  tags: {
    service: 'pms'
  }
})

const client = got.extend({
  headers: {
    'x-plex-token': config.pms?.token
  },
  responseType: 'json',
  prefixUrl: config.pms?.baseUrl
});

export async function scanDirectory(path: string): Promise<void> {

  interface Sections {
    MediaContainer: {
      Directory?: [
        {
          key: string,
          Location: [{
            path: string
          }],
          title: string
        }
      ]
    }
  }
  const { body: sections } = await client.get<Sections>('library/sections');
  for (const directory of sections.MediaContainer.Directory || []) {

    for (const location of directory.Location) {

      if (path.startsWith(location.path)) {
        log.debug(directory, `Scanning ${path} in library: ${directory.title}`);
        await client.get(`library/sections/${directory.key}/refresh`, {
          searchParams: {
            path
          }
        })
      }
    }
  }
}
