import {
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Post,
   Req,
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
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AuthDescription, AuthSummary } from './auth.constants';
import { CommonDescription } from '../common/constants/descriptions.constants';
import TokenResponseDto from './dto/token-response.dto';
import { ErrorResponse } from '../common/dto/response.dto';
import { User } from '../modules/user/user.entity';
import { CustomRequest } from '../common/interface/custom-request.interface';
import { EmailConfirmationGuard } from '../modules/email/guards/emailConfirmation.guard';

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
   ): Promise<TokenResponseDto> {
      return this.authService.signUp(authCredentialsDto);
   }

   @Post('/signin')
   @UseGuards(EmailConfirmationGuard)
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: AuthSummary.SIGN_IN_SUMMARY })
   @ApiBody({ type: AuthCreadentialsDto })
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
      @Body(ValidationPipe) authCredentialsDto: AuthCreadentialsDto,
   ): Promise<TokenResponseDto> {
      return this.authService.signIn(authCredentialsDto);
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
   async googleAuthRedirect(@Req() req: CustomRequest): Promise<User> {
      return this.authService.externalSignIn(req);
   }
}
