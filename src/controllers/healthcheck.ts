import {Request, Response} from 'express';
import ResponseData, {IResponseData} from '../common/response';

export default class HealthCheckController {
  public async healthcheck(req: Request, res: Response): Promise<void> {
    // TODO: Create service which healthchecks database and other downstream services
    const responseData: IResponseData = new ResponseData(
      'Healthcheck successfull',
      {
        status: 'up',
      }
    );
    res.status(200).json(responseData);
  }
}
