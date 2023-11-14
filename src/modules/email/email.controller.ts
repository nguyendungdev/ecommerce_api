import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { EmailService } from './email.service';
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
import { CommonDescription } from '@common/constants/descriptions.constants';
import { ErrorResponse } from '@common/dto/response.dto';
import { EmailDescription, EmailSummary } from './email.constants';

@ApiTags('Email Confirmation')
@ApiBearerAuth()
@Controller('auth/email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('')
  @ApiOperation({ summary: EmailSummary.RESEND_CONFIRMATION_LINK })
  @ApiOkResponse({
    description: EmailDescription.RESEND_CONFIRMATION_LINK_SUCCESS,
  })
  @ApiBadRequestResponse({
    description: CommonDescription.BAD_REQUEST,
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({
    description: CommonDescription.UNAUTHORIZED,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async resendConfirmationLink(@Req() request) {
    return this.emailService.resendConfirmationLink(request.user.email);
  }

  @Post('/confirm')
  @ApiOperation({ summary: EmailSummary.CONFIRM_EMAIL })
  @ApiOkResponse({
    description: EmailDescription.CONFIRM_EMAIL_SUCCESS,
  })
  @ApiBadRequestResponse({
    description: CommonDescription.BAD_REQUEST,
  })
  @ApiUnauthorizedResponse({
    description: CommonDescription.UNAUTHORIZED,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
  })
  @Post('/confirm')
  async confirm(@Query('token') token: string) {
    const email = await this.emailService.decodeConfirmationToken(token);
    return this.emailService.confirmEmail(email);
  }
}
