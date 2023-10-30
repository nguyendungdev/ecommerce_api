import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/oder-item.entity';
import { OrderItemRepository } from './order-item.repository';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { ProductService } from '../product/product.service';
import { OrderStatus } from './order-status.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OrderService {
   constructor(
      private readonly orderRepository: OrderRepository,
      private readonly orderItemRepository: OrderItemRepository,
      private readonly productService: ProductService,
      private readonly userService: UserService,
   ) {}

   /**
    * Find orders for a specific user.
    * @param userId string - ID of the user.
    * @returns Promise<Order[]> - Array of Order objects.
    * @throws NotFoundException - If no orders are found for the user.
    */
   async findOrders(userId: User['id']): Promise<Order[]> {
      if (!(await this.userService.getById(userId))) {
      }
      const orders = await this.orderRepository.getByUserId(userId);
      if (!orders || orders.length === 0) {
         throw new NotFoundException(`User has no orders`);
      }

      return orders;
   }

   /**
    * Find an order by its ID.
    * @param id string - ID of the order.
    * @returns Promise<Order> - Order object if found.
    * @throws NotFoundException - If the order is not found.
    */
   async findOrder(id: Order['id']): Promise<Order> {
      const order = this.orderRepository.getOneOrderById(id);
      if (!order) {
         throw new NotFoundException(`user have no orders`);
      }
      return order;
   }

   /**
    * Update order status based on order date.
    * @param userId string - ID of the user.
    */
   async updateStatus(userId: User['id']): Promise<void> {
      const today = new Date();
      const orders = await this.findOrders(userId);

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

   /**
    * Calculate the total price of items in an order.
    * @param orderId string - ID of the order.
    * @returns Promise<number> - Total price of the items.
    */
   async getInvoiceTotalPrice(orderId: Order['id']): Promise<number> {
      const order = await this.orderItemRepository.find({
         where: {
            order_id: orderId,
            delete_at: null,
         },
      });
      let invoicePrice = 0;
      for (const item of order) {
         invoicePrice += Number(item.total_price);
      }
      return invoicePrice;
   }

   /**
    * Create a new order item.
    * @param id string - ID of the order.
    * @param item OrderItemDto - Data for the order item.
    */
   async createOrderItem(
      id: OrderItem['id'],
      item: OrderItemDto,
   ): Promise<void> {
      const newOrderItem = await this.orderItemRepository.create();
      newOrderItem.quanity = item.quanity;
      newOrderItem.total_price =
         (await this.productService.getPrice(item.product_id)) * item.quanity;
      newOrderItem.order_id = id;
      newOrderItem.product_id = item.product_id;
      await newOrderItem.save();
   }

   /**
    * Create a new order along with its associated order items.
    * @param createOrderDto CreateOrderDto - Data to create a new order.
    */
   async createOrder(createOrderDto: CreateOrderDto): Promise<void> {
      const {
         order_date,
         status,
         shipment_date,
         comment,
         shipped_to,
         user_id,
      } = createOrderDto;
      const newOrder = await this.orderRepository.create();
      newOrder.comment = comment;
      newOrder.order_date = order_date;
      newOrder.status = status;
      newOrder.shipment_date = shipment_date;
      newOrder.shipped_to = shipped_to;
      newOrder.user_id = user_id;
      await newOrder.save();
      for (const item of createOrderDto.order_items) {
         await this.createOrderItem(newOrder.id, item);
      }
   }

   /**
    * Delete an order item by its ID.
    * @param orderItemId string - ID of the order item to delete.
    */
   async deleteOrderItem(orderItemId: OrderItem['id']): Promise<void> {
      const result = await this.orderItemRepository.softDelete(orderItemId);
      if (result.affected === 0) {
         throw new NotFoundException(`Order item not found`);
      }
   }

   /**
    * Delete an order by its ID, along with its associated order items.
    * @param orderId string - ID of the order to delete.
    */
   async deleteOrder(orderId: Order['id']): Promise<void> {
      const orderItem = await this.orderItemRepository.find({
         where: {
            order_id: orderId,
         },
      });

      if (!orderItem || orderItem.length === 0) {
         throw new NotFoundException(`Order items not found`);
      }

      const result = await this.orderRepository.softDelete(orderId);

      if (result.affected === 0) {
         throw new NotFoundException(`Order not found`);
      }

      for (const item of orderItem) {
         await this.deleteOrderItem(item.id);
      }
   }

   /**
    * Restore a soft-deleted order item by its ID.
    * @param orderItemId string - ID of the order item to restore.
    */
   async restoreOrderItem(orderItemId: OrderItem['id']): Promise<void> {
      this.orderItemRepository.restore(orderItemId);
   }
   /**
    * Restore a soft-deleted order by its ID, along with its associated order items.
    * @param orderId string - ID of the order to restore.
    */
   async restoreOrder(orderId: string): Promise<void> {
      const orderItem = await this.orderItemRepository.find({
         where: {
            order_id: orderId,
         },
      });
      this.orderRepository.restore(orderId);
      for (const item of orderItem) {
         await this.restoreOrderItem(item.id);
      }
   }

   /**
    * Update an order and its associated order items.
    * @param orderId string - Order ID.
    * @param updateOrderDto UpdateOrderDto - Data to update the order.
    * @throws NotFoundException - If the order is not found.
    * @throws BadRequestException - If provided data is invalid.
    */
   async updateOrder(
      orderId: Order['id'],
      updateOrderDto: UpdateOrderDto,
   ): Promise<void> {
      const { order_items, ...orderDto } = updateOrderDto;

      const existingOrder = await this.findOrder(orderId);
      if (!existingOrder) {
         throw new NotFoundException(
            `Order with ID ${existingOrder.id} not found`,
         );
      }
      await this.orderRepository.update(orderId, orderDto);

      if (updateOrderDto.order_items) {
         for (const newOrderUpdate of order_items) {
            const id = newOrderUpdate.order_item_id;

            // Check if the order item exists
            const existingOrderItem = await this.findOrder(orderId);

            if (!existingOrderItem) {
               throw new NotFoundException(
                  `Order item with ID ${id} not found`,
               );
            }

            const { order_item_id, ...orderItemDto } = newOrderUpdate;

            // Update the order item
            await this.orderItemRepository.update(id, orderItemDto);
         }
      }
   }
}
