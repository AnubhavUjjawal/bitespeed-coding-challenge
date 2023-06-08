import * as express from 'express';
import config from './config';
import {ILogger, WinstonLogger} from './common/logger';
import router from './router';

const app = express();
const logger: ILogger = new WinstonLogger();

app.use(express.json());
app.use('', router);

app.listen(config.PORT, () => {
  logger.info(`server is running at port ${config.PORT}`);
});
