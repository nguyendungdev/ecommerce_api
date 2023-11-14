import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@orders/entities/order.entity';
import { ProductService } from '@products/product.service';
import { Product } from '@products/entities/product.entity';
import { OrderItem } from './entites/oder-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderItemRepository } from './order-item.repository';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly productService: ProductService,
  ) { }

  async findAll(id: OrderItem['order_id']): Promise<OrderItem[]> {
    const item = await this.orderItemRepository.findByOrderId(id);
    if (!item || item.length === 0) {
      return null;
    }
    return item;
  }
  async checkQuantity(id: Product['id'], quantity: number): Promise<void> {
    const inStock = await this.productService.getQuantityInStock(id);
    if (quantity > inStock) {
      throw new NotFoundException(`Not enough quantity in stock for product with ID ${id}.Available: ${inStock}`);
    }
  }

  async createOrderItem(
    id: Order['id'],
    item: CreateOrderItemDto,
  ): Promise<void> {
    await this.checkQuantity(item.product_id, item.quantity);
    const newOrderItem = await this.orderItemRepository.create();
    newOrderItem.quantity = item.quantity;
    newOrderItem.total_price =
      (await this.productService.getPrice(item.product_id)) * item.quantity;
    newOrderItem.order_id = id;
    newOrderItem.product_id = item.product_id;
    await newOrderItem.save();
  }

  async getInvoiceTotalPrice(orderId: Order['id']): Promise<number> {
    const order = await this.findAll(orderId);
    let invoicePrice = 0;
    for (const item of order) {
      invoicePrice += Number(item.total_price);
    }
    return invoicePrice;
  }

  async deleteOrderItem(orderItemId: OrderItem['id']): Promise<void> {
    await this.orderItemRepository.softDelete(orderItemId);
  }

  async restoreOrderItem(orderItemId: OrderItem['id']): Promise<void> {
    this.orderItemRepository.restore(orderItemId);
  }

  async update(id: OrderItem['id'], orderItemDto): Promise<void> {
    await this.orderItemRepository.update(id, orderItemDto);
  }
}
