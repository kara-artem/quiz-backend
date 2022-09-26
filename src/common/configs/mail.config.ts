import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

export const getMailConfig = async (configService: ConfigService): Promise<MailerOptions> => {
  return {
    transport: {
      host: configService.get('MAIL_HOST'),
      secure: false,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: `"Quiz" <${configService.get('MAIL_FROM')}>`,
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
        rejectUnauthorized: false,
      },
    },
  };
};
