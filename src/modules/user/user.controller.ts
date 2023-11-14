import {
   Get,
   Controller,
   Param,
   UseGuards,
   HttpCode,
   HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
   ApiBadRequestResponse,
   ApiBearerAuth,
   ApiInternalServerErrorResponse,
   ApiOkResponse,
   ApiOperation,
   ApiParam,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommonDescription } from 'src/common/constants/descriptions.constants';
import { ErrorResponse } from '../../common/dto/response.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UsersSummary } from './user.constants';
import { Roles } from '../../common/decorators/role.decorators';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './roles.enum';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('user')
@Roles(Role.Admin)
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get('')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: UsersSummary.GET_ALL })
   @ApiOkResponse({
      description: CommonDescription.GET_ITEM_SUCCESS,
      type: User,
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
   async getAll() {
      console.log('get all controller');
      return this.userService.getAll();
   }

   @Get('/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: UsersSummary.GET_BY_ID })
   @ApiParam({ name: 'id', type: 'string' })
   @ApiOkResponse({
      description: CommonDescription.GET_ITEM_SUCCESS,
      type: User,
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
   async getById(@Param('id') id: string): Promise<User> {
      return this.userService.getById(id);
   }
}
