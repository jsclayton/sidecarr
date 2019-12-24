import * as yargs from 'yargs';

export interface Argv {
  readonly configPath: string
};

const argv: Argv = yargs.options({
  configPath: { alias: 'config', type: 'string', default: '/config' }
}).argv;

export default argv;
