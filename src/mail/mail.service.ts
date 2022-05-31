import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserEntity, token: string) {
    const url = `${process.env.HOST_URL}/api/auth/confirm-registration?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Подтверждение регистрации',
      template: '/templates/confirmation-register',
      context: {
        url,
      },
    });
  }
}
