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
   ApiNoContentResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReviewService } from './review.service';
import { ReviewInfoDTO } from './dto/review-info.dto';
import { CreateReviewDTO } from './dto/create-review.dto';

@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('Review')
export class ReviewController {
   constructor(private readonly reviewService: ReviewService) { }

   @Get('/')
   @ApiOperation({
      summary: "Get all product's review",
   })
   @ApiOkResponse({
      description: 'Successfully retrieved all reviews',
      type: ReviewInfoDTO,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async getReview(
      @Query('id') productId: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
   ): Promise<ReviewInfoDTO[]> {
      return await this.reviewService.getReviewByIDPaginate(productId, page);
   }

   @Post('/')
   @ApiOperation({ summary: 'Create a new review' })
   @ApiBody({ type: CreateReviewDTO })
   @ApiCreatedResponse({
      description: 'Product created successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async createProduct(
      @Body() createReviewDto: CreateReviewDTO,
   ): Promise<void> {
      await this.reviewService.create(createReviewDto);
   }

   @Delete('/:id')
   @ApiOperation({ summary: 'Delete review by ID' })
   @ApiParam({ name: 'id', type: 'string', description: 'Review ID' })
   @ApiNoContentResponse({
      description: 'Review deleted successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async deleteReviewById(@Param('id') id: string): Promise<void> {
      await this.reviewService.delete(id);
   }

   @Patch('/:id/restore/')
   @ApiOperation({ summary: 'Restore Review by ID' })
   @ApiParam({ name: 'id', type: 'string', description: 'Review ID' })
   @ApiNoContentResponse({
      description: 'Review restored successfully',
   })
   @ApiBadRequestResponse({
      description: 'Invalid request',
      type: ErrorResponse,
   })
   @ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponse,
   })
   async restoreReviewById(@Param('id') id: string): Promise<void> {
      await this.reviewService.restore(id);
   }
}
