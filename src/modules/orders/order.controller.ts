import {
  Get,
  Put,
  Body,
  Controller,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Patch,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@users/guards/roles.guard';
import { ErrorResponse } from '@common/dto/response.dto';
import { CommonDescription } from '@common/constants/descriptions.constants';
import { Roles } from '@common/decorators/role.decorators';
import { Role } from '@users/roles.enum';
import { OrdersSummary } from './order.constants';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: OrdersSummary.GET_ALL })
  @ApiOkResponse({
    description: CommonDescription.GET_ITEM_SUCCESS,
    type: [Order],
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
  async getAll(@Request() req): Promise<Order[]> {
    return this.orderService.getOrders(req.user.session_id);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: OrdersSummary.CREATE_NEW })
  @ApiCreatedResponse({
    description: CommonDescription.CREATE_ITEM_SUCCESS,
    type: Order,
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
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    this.orderService.createOrder(req.user.session_id, createOrderDto);
  }

  @Patch(':id/update-status/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: OrdersSummary.UPDATE_STATUS_BY_ID })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({
    description: CommonDescription.UPDATE_ITEM_SUCESS,
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
  async updateStatus(@Request() req) {
    return this.orderService.updateStatus(req.user.session_id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: OrdersSummary.DELETE_BY_ID })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({
    description: CommonDescription.DELETE_ITEM_SUCCESS,
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
  async delete(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @Patch(':orderId/restore/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: OrdersSummary.RESTORE_BY_ID })
  @ApiParam({ name: 'orderId', type: 'string' })
  @ApiOkResponse({
    description: CommonDescription.RESTORE_ITEM_SUCCESS,
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
  async restoreOrder(@Param('orderId') orderId: string): Promise<void> {
    return this.orderService.restoreOrder(orderId);
  }

  @Put('/:id')
  @ApiOperation({ summary: OrdersSummary.UPDATE_BY_ID })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({
    description: CommonDescription.UPDATE_ITEM_SUCESS,
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
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }
}
