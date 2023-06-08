export interface IError {
  status: number;
  message: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export class ErrorWithData extends Error implements IError {
  readonly status: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, data?: any) {
    super(message);
    this.status = 500;
    this.data = data;
  }
}
