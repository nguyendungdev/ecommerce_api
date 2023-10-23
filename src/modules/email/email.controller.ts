import {
   Controller,
   ClassSerializerInterceptor,
   UseInterceptors,
   Post,
   UseGuards,
   Req,
   Query,
} from '@nestjs/common';
import EmailService from './email.service';
import { AuthGuard } from '@nestjs/passport';

import {
   ApiTags,
   ApiBearerAuth,
   ApiOperation,
   ApiBadRequestResponse,
   ApiInternalServerErrorResponse,
   ApiOkResponse,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Email Confirmation')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('auth/email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailController {
   constructor(private readonly emailService: EmailService) { }

   @Post('')
   @ApiOperation({ summary: 'Resend email confirmation link' })
   @ApiOkResponse({
      description: 'Email confirmation link resent successfully',
   })
   @ApiBadRequestResponse({
      description: 'Bad request',
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
   })
   async resendConfirmationLink(@Req() request) {
      await this.emailService.resendConfirmationLink(request.user.email);
   }

   @Post('/confirm')
   @ApiOperation({ summary: 'Confirm email using token' })
   @ApiOkResponse({
      description: 'Email confirmed successfully',
   })
   @ApiBadRequestResponse({
      description: 'Bad request',
   })
   @ApiUnauthorizedResponse({
      description: 'Unauthorized',
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
   })
   @Post('/confirm')
   async confirm(@Query('token') token: string) {
      const email = await this.emailService.decodeConfirmationToken(token);
      await this.emailService.confirmEmail(email);
   }
}
