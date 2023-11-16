import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { createTransport, Transporter, SentMessageInfo } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { JwtService } from '@nestjs/jwt';
import { appConfig, emailConfirm } from '@configs/configs.constants';
import { UserService } from '@users/user.service';
import EmailConfirmPayload from '@auth/payloads/email-check-payload';
import { EmailMessage } from './email.constants';

@Injectable()
export class EmailService {
  private nodemailerTransport: Transporter<SentMessageInfo>;

  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
  ) {
    this.nodemailerTransport = createTransport({
      service: emailConfirm.emailService,
      auth: {
        user: emailConfirm.emailUser,
        pass: emailConfirm.emailPassword,
      },
    });
  }

  async sendVerificationLink(email: string): Promise<string> {
    const payload: EmailConfirmPayload = {
      email: email,
    };
    const token = this.jwtService.sign(payload, {
      secret: emailConfirm.secret,
      expiresIn: emailConfirm.expiresIn,
    });
    const url = `http://localhost:${appConfig.port}/auth/email-confirmation/confirm?token=${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
    await this.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
    return token;
  }
  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  async confirmEmail(email: string) {
    const user = await this.userService.getByEmail(email);
    if (user.is_confirmed) {
      throw new BadRequestException(EmailMessage.ALREADY_COMFIRMED);
    }
    await this.userService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: emailConfirm.secret,
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(email: string) {
    const user = await this.userService.getByEmail(email);
    if (user.is_confirmed) {
      throw new BadRequestException(EmailMessage.ALREADY_COMFIRMED);
    }
    await this.sendVerificationLink(email);
  }

  async resetPassword(email: string, hash: string): Promise<void> {
    const url = ` http://localhost:${appConfig.port}/auth/reset-password/?hash=${hash}`;
    const text = `We heard that you lost your password. Sorry about that! But don’t worry! You can click here: ${url} to reset your password.`;
    await this.sendMail({
      to: email,
      subject: 'Password Reset',
      text,
    });
  }
}
