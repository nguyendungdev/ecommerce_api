import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './oder-item.entity';
import { OrderItemRepository } from './order-item.repository';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { ProductService } from '../product/product.service';
import { OrderStatus } from './order-status.enum';
import { OrderDto, UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
   constructor(
      @InjectRepository(Order)
      private readonly orderRepository: OrderRepository,
      @InjectRepository(OrderItem)
      private readonly orderItemRepository: OrderItemRepository,
      private readonly productService: ProductService,
   ) {}

   /**
    * Find orders for a specific user.
    * @param userId string - ID of the user.
    * @returns Promise<Order[]> - Array of Order objects.
    * @throws NotFoundException - If no orders are found for the user.
    */
   async findOrders(userId: string): Promise<Order[]> {
      const orders = await this.orderRepository.findBy({
         userId: userId,
         deleteAt: null,
      });
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
   async findOrder(id: string): Promise<Order> {
      const order = this.orderRepository.findOneBy({
         id: id,
         deleteAt: null,
      });
      if (!order) {
         throw new NotFoundException(`user have no orders`);
      }
      return order;
   }

   /**
    * Update order status based on order date.
    * @param userId string - ID of the user.
    */
   async updateStatus(userId: string): Promise<void> {
      const today = new Date();
      const orders = await this.findOrders(userId);

      for (const item of orders) {
         const itemDate = item.orderDate;
         const threeDaysLater = new Date(itemDate);
         threeDaysLater.setDate(threeDaysLater.getDate() + 3);
         console.log(threeDaysLater);
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
   async getInvoiceTotalPrice(orderId: string): Promise<number> {
      const order = await this.orderItemRepository.find({
         where: {
            orderId: orderId,
            deleteAt: null,
         },
      });
      let invoicePrice = 0;
      for (const item of order) {
         invoicePrice += Number(item.totalPrice);
      }
      return invoicePrice;
   }

   /**
    * Create a new order item.
    * @param id string - ID of the order.
    * @param item OrderItemDto - Data for the order item.
    */
   async createOrderItem(id: string, item: OrderItemDto): Promise<void> {
      const newOrderItem = await this.orderItemRepository.create();
      newOrderItem.quantity = item.quantity;
      newOrderItem.totalPrice =
         (await this.productService.getPrice(item.productId)) * item.quantity;
      newOrderItem.orderId = id;
      newOrderItem.productId = item.productId;
      await newOrderItem.save();
   }

   /**
    * Create a new order along with its associated order items.
    * @param createOrderDto CreateOrderDto - Data to create a new order.
    */
   async createOrder(createOrderDto: CreateOrderDto): Promise<void> {
      const { orderDate, status, shipmentDate, comment, shippedTo, userId } =
         createOrderDto;
      const newOrder = await this.orderRepository.create();
      newOrder.comment = comment;
      newOrder.orderDate = orderDate;
      newOrder.status = status;
      newOrder.shipmentDate = shipmentDate;
      newOrder.shippedTo = shippedTo;
      newOrder.userId = userId;
      await newOrder.save();
      for (const item of createOrderDto.orderItems) {
         await this.createOrderItem(newOrder.id, item);
      }
   }

   /**
    * Delete an order item by its ID.
    * @param orderItemId string - ID of the order item to delete.
    */
   async deleteOrderItem(orderItemId: string): Promise<void> {
      const result = await this.orderItemRepository.softDelete(orderItemId);
      if (result.affected === 0) {
         throw new NotFoundException(`Order item not found`);
      }
   }

   /**
    * Delete an order by its ID, along with its associated order items.
    * @param orderId string - ID of the order to delete.
    */
   async deleteOrder(orderId: string): Promise<void> {
      const orderItem = await this.orderItemRepository.find({
         where: {
            orderId: orderId,
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
   async restoreOrderItem(orderItemId: string): Promise<void> {
      this.orderItemRepository.restore(orderItemId);
   }
   /**
    * Restore a soft-deleted order by its ID, along with its associated order items.
    * @param orderId string - ID of the order to restore.
    */
   async restoreOrder(orderId: string): Promise<void> {
      const orderItem = await this.orderItemRepository.find({
         where: {
            orderId: orderId,
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
      orderId: string,
      updateOrderDto: UpdateOrderDto,
   ): Promise<void> {
      const { orderItems, ...orderDto } = updateOrderDto;

      // Check if the order exists
      const existingOrder = await this.findOrder(orderId);

      // Update the order
      await this.orderRepository.update(orderId, orderDto);

      if (updateOrderDto.orderItems) {
         for (const newOrderUpdate of orderItems) {
            const id = newOrderUpdate.orderItemId;

            // Check if the order item exists
            const existingOrderItem = await this.findOrder(orderId);

            if (!existingOrderItem) {
               throw new NotFoundException(
                  `Order item with ID ${id} not found`,
               );
            }

            const { orderItemId, ...orderItemDto } = newOrderUpdate;

            // Update the order item
            await this.orderItemRepository.update(id, orderItemDto);
         }
      }
   }
}
