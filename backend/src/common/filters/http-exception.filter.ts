import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    // Fallback: nếu Nest không tự sinh "error", tự suy ra từ statusCode (vd 401 -> "Unauthorized", 404 -> "Not Found")
    const error =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      (exceptionResponse as any).error
        ? (exceptionResponse as any).error
        : (STATUS_CODES[statusCode] ?? 'Internal Server Error');

    response.status(statusCode).json({
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
