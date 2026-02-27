import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const prod = process.env.NODE_ENV === 'production';
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = prod ? 'Request failed' : exception.message;
      return res.status(status).json({ code: 'http_error', message });
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({ code: 'internal_error', message: prod ? 'Internal server error' : String(exception) });
  }
}
