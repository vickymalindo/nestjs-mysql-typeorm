import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const message = this.reflector.get<string>(
      'responseMessage',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        is_success: true,
        message,
        data,
      })),
      catchError((err) => {
        console.log(err);
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const { response } = err;
        const message =
          response?.message?.length !== 0
            ? response.message === undefined
              ? response
              : response.message
            : response;
        const errorResponse = {
          statusCode,
          is_success: false,
          message: message || 'Internal server error',
          data: {},
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
