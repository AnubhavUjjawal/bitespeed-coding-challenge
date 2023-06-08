import {createLogger, transports, format, Logger} from 'winston';

export interface ILogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, meta?: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, meta?: any): void;
}

export class WinstonLogger implements ILogger {
  // TODO: Await logs to be written before exiting the process
  private static logger: Logger;

  constructor() {
    if (!WinstonLogger.logger) {
      WinstonLogger.logger = createLogger({
        transports: [new transports.Console()],
        format: format.json(),
        level: 'info',
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addTimestamp(meta?: any): any {
    return {
      ...meta,
      timestamp: new Date().toISOString(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(message: string, meta?: any): void {
    meta = this.addTimestamp(meta);
    WinstonLogger.logger.info(message, meta);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: string, meta?: any): void {
    meta = this.addTimestamp(meta);
    WinstonLogger.logger.error(message, meta);
  }
}
