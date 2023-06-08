import * as express from 'express';
import config from './config';
import {ILogger, WinstonLogger} from './common/logger';
import router from './router';
import jsonErrorHandler from './middlewares/error';

const app = express();
const logger: ILogger = new WinstonLogger();

app.use(express.json());
app.use('', router);
app.use(jsonErrorHandler);
app.listen(config.PORT, () => {
  logger.info(`server is running at port ${config.PORT}`);
});
