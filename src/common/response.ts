export interface IResponseData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  message: string;
  error: string | null;
}

class ResponseData<T> implements IResponseData {
  public data: T | null;
  public message: string;
  public error: string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, data?: any, error?: string) {
    this.data = data ?? null;
    this.message = message;
    this.error = error ?? null;
  }
}

export default ResponseData;
