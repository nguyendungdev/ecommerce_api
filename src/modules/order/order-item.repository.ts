import { Repository } from 'typeorm';
import { OrderItem } from './oder-item.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {}
