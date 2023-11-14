import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { User } from '@users/entities/user.entity';
import { CommonDescription } from '@common/constants/descriptions.constants';
import { ErrorResponse } from '@common/dto/response.dto';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthDescription, AuthSummary } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import AuthLoginDto from './dto/auth-login.dto';
import SignUpResponseDto from './dto/signup-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: AuthSummary.SIGN_UP_SUMMARY })
  @ApiBody({ type: AuthCreadentialsDto })
  @ApiCreatedResponse({
    description: AuthDescription.SIGN_UP_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiConflictResponse({
    description: AuthDescription.EMAIL_EXIST,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCreadentialsDto,
  ): Promise<SignUpResponseDto> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AuthSummary.SIGN_IN_SUMMARY })
  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponse({
    description: AuthDescription.SIGN_IN_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthLoginDto,
  ): Promise<TokenResponseDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('reset/password')
  @ApiBody({ type: AuthResetPasswordDto })
  @ApiOperation({ summary: AuthSummary.RESET_PASSWORD_SUMMARY })
  @ApiOkResponse({
    description: AuthDescription.RESET_PASSWORD_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @Post('forgot/password')
  @ApiBody({ type: AuthForgotPasswordDto })
  @ApiOperation({ summary: AuthSummary.FORGOT_PASWORD_SUMMARY })
  @ApiOkResponse({
    description: AuthDescription.FORGOT_PASWORD,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Get('/google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  googleSignIn(): Promise<void> {
    return;
  }

  @Get('/google/callback')
  @ApiOperation({ summary: 'Redirect site after google login has succeeded' })
  @ApiOkResponse({
    description: AuthDescription.SIGN_IN_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req): Promise<User> {
    return this.authService.externalSignIn(req);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: AuthSummary.REFRESH_TOKEN_SUMMARY })
  @ApiOkResponse({
    description: AuthDescription.REFRESH_TOKEN_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async refresh(@Request() req): Promise<TokenResponseDto> {
    return this.authService.refreshToken(req.user.session_id);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: AuthSummary.LOG_OUT_SUMMARY })
  @ApiOkResponse({
    description: AuthDescription.LOG_OUT_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async logout(@Request() req): Promise<void> {
    await this.authService.logout(req.user.session_id);
  }
}
