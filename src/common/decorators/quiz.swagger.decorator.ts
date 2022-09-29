import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiBodyOptions, ApiOkResponse, ApiOperation, ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

type CallbackFunction = () => void;

export function QuizSwaggerDecorator(
  summary: string,
  responseType?: Type<unknown> | CallbackFunction | [CallbackFunction] | string,
  params?: {
    apiQueryOptions?: ApiQueryOptions;
    apiBodyOptions?: ApiBodyOptions;
  },
): MethodDecorator {
  const decorators = [];
  responseType && decorators.push(ApiOkResponse({ type: responseType }));
  params?.apiQueryOptions && decorators.push(ApiQuery({ ...params.apiQueryOptions }));
  params?.apiBodyOptions && decorators.push(ApiBody({ ...params.apiBodyOptions }));
  return applyDecorators(ApiOperation({ summary }), ...decorators);
}
