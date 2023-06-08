import {NextFunction, Request, Response} from 'express';
import ResponseData, {IResponseData} from '../common/response';
import {IError} from '../common/error';

const jsonErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const resStatus = err?.status || 500;
  const resData: IResponseData = new ResponseData(
    'ERROR',
    err?.data ?? null,
    err.message
  );
  res.status(resStatus).json(resData);
};

export default jsonErrorHandler;
