import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

export function StatusCode(statusCode: HttpStatus, successMessage?: string): MethodDecorator {
  return applyDecorators(
    ((
      target: Record<string, any>,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
    ) => {
      const originalMethod = descriptor.value;

      descriptor.value = new Proxy(originalMethod, {
        apply: async function (target: (...args: any[]) => Promise<any>, thisArg: any, argArray: any[]) {
          const data = await target.apply(thisArg, argArray);

          return {
            statusCode,
            message: [successMessage] || null,
            data,
          };
        },
      });
    }) as MethodDecorator,
    HttpCode(statusCode),
  );
}
