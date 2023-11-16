import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemService } from '@order-item/order-item.service';
import { Session } from '@sessions/entities/session.entity';
import { UserService } from '@users/user.service';
import { OrderRepository } from './order.repository';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order-status.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersMessage } from './order.constants';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemService: OrderItemService,
    private readonly userService: UserService,
  ) {}

  async getOrders(sessionId: Session['id']): Promise<Order[]> {
    const userId = await this.userService.getBySessionId(sessionId)[0].id;
    const orders = await this.orderRepository.getBySessionId(userId);
    if (!orders || orders.length === 0) {
      throw new NotFoundException(OrdersMessage.NOT_FOUND_BY_USER_ID);
    }

    return orders;
  }

  async findOrder(id: Order['id']): Promise<Order> {
    const order = this.orderRepository.getOneOrderById(id);
    if (!order) {
      throw new NotFoundException(OrdersMessage.NOT_FOUND_BY_USER_ID);
    }
    return order;
  }

  async updateStatus(userId: Order['user_id']): Promise<void> {
    const today = new Date();
    const orders = await this.orderRepository.find({
      where: {
        user_id: userId,
        delete_at: null,
      },
    });
    for (const item of orders) {
      const itemDate = item.order_date;
      const threeDaysLater = new Date(itemDate);
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      const eightDaysLater = new Date(itemDate);
      eightDaysLater.setDate(eightDaysLater.getDate() + 7);

      if (threeDaysLater.getTime() === today.getTime()) {
        item.status = OrderStatus.SHIPPED;
      } else if (eightDaysLater.getTime() === today.getTime()) {
        item.status = OrderStatus.DELIVERED;
      } else {
        item.status = OrderStatus.PROCESSED;
      }
      await item.save();
    }
  }

  async createOrder(
    sessionId: Session['id'],
    createOrderDto: CreateOrderDto,
  ): Promise<void> {
    const { status, shipment_date, comment, shipped_to } = createOrderDto;
    const userId = await this.userService.getBySessionId(sessionId);
    const newOrder = await this.orderRepository.create({
      comment,
      status,
      shipment_date,
      shipped_to,
      user_id: userId[0].id,
    });
    await newOrder.save();
    for (const item of createOrderDto.order_items) {
      await this.orderItemService.createOrderItem(newOrder.id, item);
    }
  }

  async deleteOrder(orderId: Order['id']): Promise<void> {
    const orderItem = await this.orderItemService.findAll(orderId);

    if (!orderItem) {
      throw new NotFoundException(OrdersMessage.NOT_FOUND_BY_ORDER_ID);
    }

    const result = await this.orderRepository.softDelete(orderId);

    if (result.affected === 0) {
      throw new NotFoundException(OrdersMessage.NOT_FOUND_BY_ID);
    }

    for (const item of orderItem) {
      await this.orderItemService.deleteOrderItem(item.id);
    }
  }

  async restoreOrder(orderId: string): Promise<void> {
    const orderItem = await this.orderItemService.findAll(orderId);
    this.orderRepository.restore(orderId);
    for (const item of orderItem) {
      await this.orderItemService.restoreOrderItem(item.id);
    }
  }

  async updateOrder(
    orderId: Order['id'],
    updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    const { order_items, ...orderDto } = updateOrderDto;

    const existingOrder = await this.findOrder(orderId);
    if (!existingOrder) {
      throw new NotFoundException(OrdersMessage.NOT_FOUND_BY_ID);
    }
    await this.orderRepository.update(orderId, orderDto);

    if (updateOrderDto.order_items) {
      for (const newOrderUpdate of order_items) {
        const id = newOrderUpdate.order_item_id;
        const existingOrderItem = await this.findOrder(orderId);
        if (!existingOrderItem) {
          throw new NotFoundException(OrdersMessage.NOT_FOUND_BY_ORDER_ID);
        }
        const { order_item_id, ...orderItemDto } = newOrderUpdate;
        await this.orderItemService.update(id, orderItemDto);
      }
    }
  }
}
