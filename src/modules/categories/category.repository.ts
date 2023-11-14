import { NotFoundException } from '@nestjs/common';
import { CommonMessage } from '../../common/constants/messages.constants';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';

@Injectable()
export class CategorysRepository extends Repository<Category> {}
