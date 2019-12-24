import Conf from 'conf';
import argv from './argv';

const file = new Conf({
  cwd: argv.configPath
});

export interface Config {

  readonly server: ServerConfig;
  readonly slack: SlackConfig;
}

class RootConfigImpl implements Config {

  readonly server: ServerConfig;
  readonly slack: SlackConfig;

  constructor() {
    this.server = new ServerConfigImpl();
    this.slack = new SlackConfigImpl();
  }
}

export interface ServerConfig {

  readonly baseUrl: string;
}

class ServerConfigImpl implements ServerConfig {

  readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.BASE_URL || file.get('server.baseUrl') || 'http://localhost:8000';
  }
}

export interface SlackConfig {

  readonly token?: string;
}

class SlackConfigImpl implements SlackConfig {

  readonly token?: string;

  constructor() {
    this.token = process.env.SLACK_TOKEN || file.get('slack.token')
  }
}

const config: Config = new RootConfigImpl();
export default config;
