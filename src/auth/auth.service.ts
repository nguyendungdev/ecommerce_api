import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import JwtPayload from './payloads/jwtPayload';
import { AuthMessage } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';
import { UserService } from '../modules/user/user.service';
import { User } from '../modules/user/user.entity';
import { emailConfirm } from '../configs/configs.constants';
import EmailService from '../modules/email/email.service';
import EmailConfirmPayload from './payloads/EmailCheckPayload';
import { CustomRequest } from '../common/interface/custom-request.interface';

@Injectable()
export class AuthService {
   constructor(
      private readonly usersService: UserService,
      private readonly jwtService: JwtService,
      private readonly emailService: EmailService,
   ) {}

   /**
    * Sign up a user.
    * @param authCredentialsDto AuthCredentialDto - User's authentication credentials.
    * @returns Promise<TokenResponseDto> - Object containing the JWT access token.
    */
   async signUp(
      authCredentialsDto: AuthCreadentialsDto,
   ): Promise<TokenResponseDto> {
      const payload: JwtPayload = {
         email: authCredentialsDto.email,
         roles: authCredentialsDto.roles,
      };
      await this.usersService.create(authCredentialsDto);
      const jwtAccessToken = await this.jwtService.signAsync(payload);
      await this.sendVerificationLink(payload.email);
      return { jwtAccessToken };
   }

   /**
    * Send a verification link to the provided email address.
    * @param email string - User's email address.
    */
   async sendVerificationLink(email: string): Promise<void> {
      const payload: EmailConfirmPayload = {
         email: email,
      };
      const token = this.jwtService.sign(payload, {
         secret: emailConfirm.sercret,
         expiresIn: emailConfirm.expiresIn,
      });
      const url = `${emailConfirm.emailUrl}?token=${token}`;
      const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
      await this.emailService.sendMail({
         to: email,
         subject: 'Email confirmation',
         text,
      });
   }

   /**
    * Sign in a user with provided authentication credentials.
    * @param authCredentialsDto AuthCredentialsDto - User's authentication credentials.
    * @returns Promise<TokenResponseDto> - Object containing the JWT access token.
    * @throws BadRequestException - If the provided credentials are invalid.
    */
   async signIn(
      authCredentialsDto: AuthCreadentialsDto,
   ): Promise<TokenResponseDto> {
      const { email, password } = authCredentialsDto;
      const user = await this.usersService.getByEmail(email);
      // If user with email exist and the password is valid.
      if (user && (await user.validatePassword(password))) {
         const { roles } = await this.usersService.getInfo(email);
         const payload: JwtPayload = { email, roles };
         const jwtAccessToken = await this.jwtService.signAsync(payload);
         return { jwtAccessToken };
      }
      // Else return an error.
      throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
   }

   /**
    * Get user information from the custom request object.
    * @param request CustomRequest - Custom request object containing user information.
    * @returns Promise<User> - The user object from the request.
    */
   async externalSignIn(request: CustomRequest): Promise<User> {
      return request.user;
   }
}
