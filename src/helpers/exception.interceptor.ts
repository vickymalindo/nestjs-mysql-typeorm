import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const statusCode = err instanceof HttpException ? err.getStatus() : 500;
    console.log(exception);
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      is_success: false,
      message: exception.message,
      data: {},
    });
  }
}
