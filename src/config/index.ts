import Conf from 'conf';
import argv from './argv';

const file = new Conf({
  cwd: argv.configPath
});

export interface Config {

  readonly pms?: PmsConfig;
  readonly server: ServerConfig;
  readonly slack?: SlackConfig;
}

export interface PmsConfig {

  readonly baseUrl?: string;
  readonly token?: string;
}

export interface ServerConfig {

  readonly baseUrl: string;
}

export interface SlackConfig {

  readonly token?: string;
}

const config: Config = {

  pms: {
    get baseUrl () { return process.env.SIDECARR_PMS_BASE_URL || file.get('pms.baseUrl') || 'http://localhost:32400'; },
    get token () { return process.env.SIDECARR_PMS_TOKEN || file.get('pms.token'); }
  },

  server: {
    get baseUrl () { return process.env.SIDECARR_BASE_URL || file.get('server.baseUrl') || 'http://localhost:8000'; }
  },

  slack: {
    get token() { return  process.env.SIDECARR_SLACK_TOKEN || file.get('slack.token'); }
  }
}
export default config;
