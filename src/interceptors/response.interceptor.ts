import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { SuccessResponse } from 'src/users/dtos/Response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: any) => {
        const statusCode = response.statusCode || 200;
        console.log(statusCode);
        const message = data?.message || 'Success';
        const responseData = data?.data !== undefined ? data.data : null;
        new SuccessResponse(responseData, message, statusCode);
      }),
    );
  }
}
