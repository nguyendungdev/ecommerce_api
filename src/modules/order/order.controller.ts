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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
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
   ApiNoContentResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/create-order.dto';
import { ErrorResponse } from '../../common/dto/response.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CommonDescription } from 'src/common/constants/descriptions.constants';
import { CommonSummary } from 'src/common/constants/summary.constants';

@Controller('order')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('order')
export class OrderController {
   constructor(private readonly orderService: OrderService) { }

   @Get('/get/:id')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get orders by user ID' })
   @ApiParam({ name: 'id', type: 'string' })
   @ApiOkResponse({
      description: 'Get orders successfully',
      type: [Order],
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async getOrder(@Param('id') userId: string): Promise<Order[]> {
      return this.orderService.findOrders(userId);
   }

   @Post('/create')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: `${CommonSummary.CREATE_NEW_ITEM} order` })
   @ApiCreatedResponse({
      description: 'Order created successfully',
      type: Order,
   })
   @ApiBadRequestResponse({
      description: 'Bad request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async createOrder(@Body() createOrderDto: CreateOrderDto) {
      this.orderService.createOrder(createOrderDto);
   }

   @Patch('/update-status/:id')
   @HttpCode(HttpStatus.NO_CONTENT)
   @ApiOperation({ summary: `${CommonSummary.UPDATE_ITEM} order status by ID` })
   @ApiParam({ name: 'id', type: 'string' })
   @ApiNoContentResponse({
      description: 'Order status updated successfully',
   })
   @ApiBadRequestResponse({
      description: 'Bad request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async updateStatus(@Param('id') id: string) {
      this.orderService.updateStatus(id);
   }

   @Delete('/delete/:id')
   @HttpCode(HttpStatus.NO_CONTENT)
   @ApiOperation({ summary: `${CommonSummary.DELETE_ITEM} an order by ID` })
   @ApiParam({ name: 'id', type: 'string' })
   @ApiNoContentResponse({
      description: CommonDescription.DELETE_ITEM_SUCCESS,
   })
   @ApiBadRequestResponse({
      description: CommonDescription.BAD_REQUEST,
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: CommonDescription.INTERNAL_SERVER_ERROR,
      type: ErrorResponse,
   })
   async delete(@Param('id') id: string) {
      this.orderService.deleteOrder(id);
   }

   @Patch(':orderId/restore/:id')
   @HttpCode(HttpStatus.NO_CONTENT)
   @ApiOperation({ summary: 'Restore a soft-deleted order by ID' })
   @ApiParam({ name: 'orderId', type: 'string' })
   @ApiNoContentResponse({
      description: CommonDescription.RESTORE_ITEM_SUCCESS,
   })
   @ApiBadRequestResponse({
      description: CommonDescription.BAD_REQUEST,
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async restoreOrder(@Param('orderId') orderId: string): Promise<void> {
      return this.orderService.restoreOrder(orderId);
   }

   @Put('/update/:id')
   @ApiOperation({ summary: 'Update order by ID' })
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
