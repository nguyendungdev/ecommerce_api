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
   NotFoundException,
   Patch,
   Query,
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
   ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/create-order.dto';
import { ErrorResponse } from '../../common/dto/response.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CommonDescription } from '../../common/constants/descriptions.constants';
import { OrdersSummary } from './order.constants';

@Controller('order')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('order')
export class OrderController {
   constructor(private readonly orderService: OrderService) {}

   @Get('/')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: OrdersSummary.GET_ALL })
   @ApiQuery({ name: 'id', type: 'string' })
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
   async getOrder(@Query('id') userId: string): Promise<Order[]> {
      console.log(userId);
      return this.orderService.findOrders(userId);
   }

   @Post('')
   @HttpCode(HttpStatus.CREATED)
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
   async createOrder(@Body() createOrderDto: CreateOrderDto) {
      this.orderService.createOrder(createOrderDto);
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
   async updateStatus(@Param('id') id: string) {
      this.orderService.updateStatus(id);
   }

   @Delete('/:id')
   @HttpCode(HttpStatus.NO_CONTENT)
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
      this.orderService.deleteOrder(id);
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
      try {
         await this.orderService.updateOrder(id, updateOrderDto);
      } catch (e) {
         throw new NotFoundException(e);
      }
   }
}
