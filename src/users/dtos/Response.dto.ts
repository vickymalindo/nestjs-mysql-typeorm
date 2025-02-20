export class SuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;

  constructor(data: T, message = 'Success', statusCode = 200) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}

export class ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;

  constructor(message = 'Something wen wrong', statusCode = 500) {
    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
  }
}
