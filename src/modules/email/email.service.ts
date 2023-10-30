import {
   BadRequestException,
   Injectable,
   Inject,
   forwardRef,
} from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { JwtService } from '@nestjs/jwt';
import { emailConfirm } from '../../configs/configs.constants';
import { UserService } from '../users/user.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export default class EmailService {
   private nodemailerTransport: Mail;

   constructor(
      private readonly userService: UserService,
      @Inject(forwardRef(() => JwtService))
      private readonly jwtService: JwtService,
      @Inject(forwardRef(() => AuthService))
      private readonly authService: AuthService,
   ) {
      this.nodemailerTransport = createTransport({
         service: emailConfirm.emailService,
         auth: {
            user: emailConfirm.emailUser,
            pass: emailConfirm.emailPassword,
         },
      });
   }

   /**
    * Send an email using the nodemailer transport.
    * @param options Mail.Options - Email sending options.
    */
   sendMail(options: Mail.Options) {
      return this.nodemailerTransport.sendMail(options);
   }

   /**
    * Confirm the user's email.
    * @param email string - User's email address.
    * @throws BadRequestException - If the email is already confirmed.
    */
   async confirmEmail(email: string) {
      const user = await this.userService.getByEmail(email);
      if (user.is_confirmed) {
         throw new BadRequestException('Email already confirmed');
      }
      await this.userService.markEmailAsConfirmed(email);
   }

   /**
    * Decode and verify the email confirmation token.
    * @param token string - Email confirmation token.
    * @returns string - Decoded email from the token.
    * @throws BadRequestException - If the token is invalid or expired.
    */
   async decodeConfirmationToken(token: string) {
      try {
         const payload = await this.jwtService.verifyAsync(token, {
            secret: emailConfirm.sercret,
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

   /**
    * Resend the email confirmation link to the user.
    * @param email string - User's email address.
    * @throws BadRequestException - If the email is already confirmed.
    */
   public async resendConfirmationLink(email: string) {
      const user = await this.userService.getByEmail(email);
      if (user.is_confirmed) {
         throw new BadRequestException('Email already confirmed');
      }
      await this.authService.sendVerificationLink(email);
   }
}
