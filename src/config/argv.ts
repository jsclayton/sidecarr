import * as yargs from 'yargs';

export interface Argv {
  readonly configPath?: string
};

const argv: Argv = yargs.options({
  configPath: { alias: 'config', type: 'string' }
}).argv;

export default argv;
