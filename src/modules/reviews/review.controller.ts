import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '@common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CommonDescription } from '@common/constants/descriptions.constants';
import { ReviewService } from './review.service';
import { ReviewInfoDTO } from './dto/review-info.dto';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ReviewsSummary } from './review.constants';

@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/')
  @ApiOperation({
    summary: ReviewsSummary.GET_ALL,
  })
  @ApiOkResponse({
    description: CommonDescription.GET_ITEM_SUCCESS,
    type: ReviewInfoDTO,
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
  async getReviews(
    @Query('id') productId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<ReviewInfoDTO[]> {
    return this.reviewService.getReviewByIDPaginate(productId, page);
  }

  @Post('/')
  @ApiOperation({ summary: ReviewsSummary.CREATE_NEW })
  @ApiBody({ type: CreateReviewDTO })
  @ApiCreatedResponse({
    description: CommonDescription.CREATE_ITEM_SUCCESS,
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
  async createProduct(@Body() createReviewDto: CreateReviewDTO): Promise<void> {
    return this.reviewService.create(createReviewDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: ReviewsSummary.DELETE_BY_ID })
  @ApiParam({ name: 'id', type: 'string', description: 'Review ID' })
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
  async deleteReviewById(@Param('id') id: string): Promise<void> {
    return this.reviewService.delete(id);
  }

  @Patch('/:id/restore/')
  @ApiOperation({ summary: ReviewsSummary.RESTORE_BY_ID })
  @ApiParam({ name: 'id', type: 'string', description: 'Review ID' })
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
  async restoreReviewById(@Param('id') id: string): Promise<void> {
    return this.reviewService.restore(id);
  }
}
